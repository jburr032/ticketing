import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";
import { Order } from "../../models/order.model";
import { OrderStatus } from "@parkerco/common";

import { stripe } from "../../stripe";

jest.mock("../../stripe");

it("Check the payment request returns 401 if user is not authorised", async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    price: 100,
    userId: mongoose.Types.ObjectId().toHexString(),
  });
  await order.save();

  await request(app)
    .post("/api/v1/payments")
    .set("Cookie", global.signIn())
    .send({ token: "kjdksjdkj", orderId: order.id })
    .expect(401);
});

it("Check the payment request returns 400 if order has been cancelled", async () => {
  const cookie = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Cancelled,
    price: 100,
    userId: cookie,
  });

  await order.save();

  await request(app)
    .post("/api/v1/payments")
    .set("Cookie", global.signIn(cookie))
    .send({ token: order.userId, orderId: order.id })
    .expect(400);
});

it("Check the payment request returns 404 if order does not exist", async () => {
  return request(app)
    .post("/api/v1/payments")
    .set("Cookie", global.signIn())
    .send({
      token: mongoose.Types.ObjectId().toHexString(),
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("Returns a 201 with valid inputs", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    price: 100,
    userId,
  });

  await order.save();

  await request(app)
    .post("/api/v1/payments")
    .set("Cookie", global.signIn(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(order.price * 100);
  expect(chargeOptions.currency).toEqual("usd");
});
