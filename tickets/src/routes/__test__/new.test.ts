import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket.model";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/v1/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("rejects access if user is NOT signed in", async () => {
  await request(app).post("/api/v1/tickets").send({}).expect(401);
});

it("allows access if user is signed in", async () => {
  const cookie = global.signIn();
  const response = await request(app)
    .post("/api/v1/tickets")
    .set("Cookie", cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if invalid ticket is provided", async () => {
  const cookie = global.signIn();

  await request(app).post("/api/v1/tickets").set("Cookie", cookie).send({
    title: "",
    price: 10,
  });

  return request(app).post("/api/v1/tickets").set("Cookie", cookie).send({
    price: 10,
  });
});

it("returns an errir if invalid price is provided", async () => {
  const cookie = global.signIn();

  await request(app).post("/api/v1/tickets").set("Cookie", cookie).send({
    title: "Title",
    price: -10,
  });

  return request(app).post("/api/v1/tickets").set("Cookie", cookie).send({
    title: "Title",
  });
});

it("creates a ticket with valid inputs", async () => {
  let collection;
  const title = "Title";
  const cookie = global.signIn();

  collection = await Ticket.find({});

  expect(collection.length).toEqual(0);

  await request(app)
    .post("/api/v1/tickets")
    .set("Cookie", cookie)
    .send({
      title,
      price: 10,
    })
    .expect(201);

  collection = await Ticket.find({});

  expect(collection.length).toEqual(1);
  expect(collection[0].price).toEqual(10);
  expect(collection[0].title).toEqual(title);
});

it("Checks that the NATS publish callback was successful", async () => {
  const title = "Title";
  const cookie = global.signIn();

  await request(app)
    .post("/api/v1/tickets")
    .set("Cookie", cookie)
    .send({
      title,
      price: 10,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
