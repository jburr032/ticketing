import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("Returns a 404 Not Found if non-existent ID is submitted", async () => {
  const cookie = global.signIn();
  const id = new mongoose.Types.ObjectId().toHexString();

  const res = await request(app)
    .get(`/api/v1/tickets/${id}`)
    .set("Cookie", cookie)
    .send()
    .expect(404);
});

it("Returns a 200 if a ticket was fetched with the correct ID", async () => {
  const cookie = global.signIn();
  const title = "Concert";
  const price = 100;

  // Makes POST request to create a ticket
  const response = await request(app)
    .post("/api/v1/tickets")
    .set("Cookie", cookie)
    .send({ title, price })
    .expect(201);

  // Makes GET requet to fetch ticket
  const ticketResponse = await request(app)
    .get(`/api/v1/tickets/${response.body.id}`)
    // .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
