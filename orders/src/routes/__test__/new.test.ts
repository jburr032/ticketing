import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";
import { Ticket } from "../../models/ticket.model";
import { Order, OrderStatus } from "../../models/order.model";
import { natsWrapper } from "../../nats-wrapper";

it("Returns 404 if ticket does not exist", async () => {
  await request(app)
    .post("/api/v1/orders")
    .set("Cookie", global.signIn())
    .send({ ticketId: mongoose.Types.ObjectId() })
    .expect(404);
});

it("Returns 400 if ticket is already reserved", async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "Concert",
    price: 100,
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: "lfjdkhf",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  order.save();

  return request(app)
    .post("/api/v1/orders")
    .set("Cookie", global.signIn())
    .send({ tickedId: ticket.id })
    .expect(400);
});

it("Returns 201 if valid credentials are submitted", async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "Concert",
    price: 100,
  });
  await ticket.save();

  const ticketOrder = await request(app)
    .post("/api/v1/orders")
    .set("Cookie", global.signIn())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("Emits published order created event", async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "Concert",
    price: 100,
  });
  await ticket.save();

  const ticketOrder = await request(app)
    .post("/api/v1/orders")
    .set("Cookie", global.signIn())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
