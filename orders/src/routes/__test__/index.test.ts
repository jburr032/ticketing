import request from "supertest";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket.model";
import { Order, OrderStatus } from "../../models/order.model";
import { app } from "../../app";

const createTicket = async (ticket: { title: string; price: number }) => {
  const returnedTicket = Ticket.build(ticket);
  await returnedTicket.save();

  return returnedTicket;
};

it("Fetches orders for a particular user", async () => {
  // Create three tickets
  const ticket1 = await createTicket({ title: "Concert 1", price: 10 });
  const ticket2 = await createTicket({ title: "Concert 2", price: 30 });
  const ticket3 = await createTicket({ title: "Concert 3", price: 50 });

  // Create one order as user #1
  await request(app)
    .post("/api/v1/orders")
    .set("Cookie", global.signIn())
    .send({ ticket: ticket1 });

  // Create two orders as user #2
  const cookieUser2 = global.signIn();

  const { body: order2 } = await request(app)
    .post("/api/v1/orders")
    .set("Cookie", cookieUser2)
    .send({ ticketId: ticket2.id })
    .expect(201);

  const { body: order3 } = await request(app)
    .post("/api/v1/orders")
    .set("Cookie", cookieUser2)
    .send({ ticketId: ticket3.id })
    .expect(201);

  // Make a request to get orders for user #2
  const response = await request(app)
    .get("/api/v1/orders")
    .set("Cookie", cookieUser2)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
  // Using response.body[0].ticket.id returns the same value
  // but the 'deep' equality compares the object keys
  // so the value *and* the key needs to be the same
  expect(response.body[0].id).toEqual(order2.id);
  expect(response.body[1].id).toEqual(order3.id);
});

it("Checks that a user cannot access another user's orders", async () => {
  const ticket1 = await createTicket({ title: "Concert 1", price: 10 });

  // Create one order as user #1
  const cookieUser1 = global.signIn();
  await request(app)
    .post("/api/v1/orders")
    .set("Cookie", cookieUser1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  // Make a request as user #2 for the same ticket
  const response = await request(app)
    .get("/api/v1/orders")
    .set("Cookie", global.signIn())
    .send()
    .expect(200);

  expect(response.body.ticket).toBeUndefined();
});
