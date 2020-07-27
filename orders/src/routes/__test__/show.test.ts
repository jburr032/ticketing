import mongoose from "mongoose";
import request from "supertest";

import { app } from "../../app";
import { Ticket } from "../../models/ticket.model";

it("Fetches a user's order with order ID", async () => {
  const cookie = global.signIn();
  // Create a ticket
  const ticket = Ticket.build({ title: "Concert", price: 100 });
  await ticket.save();

  // Create an order
  const { body: sentOrder } = await request(app)
    .post("/api/v1/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make a request to get the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/v1/orders/${sentOrder.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(200);
  // Compare the order response with the request response
  expect(fetchedOrder.id).toEqual(sentOrder.id);
});

it("Fetches a user's order with order ID", async () => {
  const cookie = global.signIn();
  // Create a ticket
  const ticket = Ticket.build({ title: "Concert", price: 100 });
  await ticket.save();

  // Create an order
  const { body: sentOrder } = await request(app)
    .post("/api/v1/orders")
    .set("Cookie", cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make a request to get the order
  return request(app)
    .get(`/api/v1/orders/${sentOrder.id}`)
    .set("Cookie", global.signIn())
    .send()
    .expect(401);
});
