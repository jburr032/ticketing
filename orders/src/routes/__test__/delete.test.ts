import request from "supertest";

import { app } from "../../app";
import { Ticket } from "../../models/ticket.model";
import { OrderStatus } from "@parkerco/common";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";

it("Updates order status to cancelled", async () => {
  // Persist a cookie
  const cookie = global.signIn();

  // Create a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "Concert 1",
    price: 100,
  });
  ticket.save();

  // Create an order
  const { body: order } = await request(app)
    .post("/api/v1/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to cancel order
  const { body: updatedOrder } = await request(app)
    .patch(`/api/v1/orders/${order.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(updatedOrder.status).toEqual(OrderStatus.Cancelled);
});

it("Returns 401 if user does not own the order", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "Concert 1",
    price: 100,
  });
  ticket.save();

  // Create an order
  const { body: order } = await request(app)
    .post("/api/v1/orders")
    .set("Cookie", global.signIn())
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to cancel order with different user
  return request(app)
    .patch(`/api/v1/orders/${order.id}`)
    .set("Cookie", global.signIn())
    .send()
    .expect(401);
});

it("Check cancelled event was published", async () => {
  // Persist a cookie
  const cookie = global.signIn();

  // Create a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "Concert 1",
    price: 100,
  });
  ticket.save();

  // Create an order
  const { body: order } = await request(app)
    .post("/api/v1/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to cancel order
  const { body: updatedOrder } = await request(app)
    .patch(`/api/v1/orders/${order.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
