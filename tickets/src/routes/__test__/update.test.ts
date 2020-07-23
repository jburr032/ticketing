import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("Returns a 404 if the provided ID does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  return request(app)
    .put(`/api/v1/tickets/${id}`)
    .set("Cookie", global.signIn())
    .send({
      title: "Fake Title",
      price: 30,
    })
    .expect(404);
});

it("Returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  return request(app)
    .put(`/api/v1/tickets/${id}`)
    .send({
      title: "Fake Title",
      price: 30,
    })
    .expect(401);
});

it("Returns a 401 if the user does not own a ticket", async () => {
  const response = await request(app)
    .post(`/api/v1/tickets`)
    .set("Cookie", global.signIn())
    .send({
      title: "Fake Title",
      price: 40.0,
    })
    .expect(201);

  await request(app)
    // Pass in the ticket ID from the response above
    .put(`/api/v1/tickets/${response.body.id}`)
    .set("Cookie", global.signIn())
    .send({
      title: "Fake",
      price: 10,
    })
    .expect(401);

  expect(response.body.title).toEqual("Fake Title");
  expect(response.body.price).toEqual(40.0);
});

it("Returns a 400 if the user provided an invalid title or price", async () => {
  const cookie = global.signIn();

  const response = await request(app)
    .post(`/api/v1/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "Fake Title",
      price: 40.0,
    })
    .expect(201);

  const invalidPutResponse = await request(app)
    .put(`/api/v1/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: -100,
    })
    .expect(400);

  expect(invalidPutResponse.body.title).not.toEqual(response.body.title);
  expect(invalidPutResponse.body.price).not.toEqual(response.body.price);
});

it("Updates the ticket provided valid inputs", async () => {
  const cookie = global.signIn();

  const response = await request(app)
    .post(`/api/v1/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "Fake Title",
      price: 40.0,
    })
    .expect(201);

  const validUpdateResponse = await request(app)
    // Pass in the ticket ID from the response above
    .put(`/api/v1/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Fake",
      price: 10,
    })
    .expect(200);

  const ticket = await request(app)
    .get(`/api/v1/tickets/${validUpdateResponse.body.id}`)
    .send();

  expect(ticket.body.title).toEqual("Fake");
  expect(ticket.body.price).toEqual(10);
});
