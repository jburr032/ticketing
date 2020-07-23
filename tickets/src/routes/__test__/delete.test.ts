import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("Returns a 401 if user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  const response = await request(app)
    .post(`/api/v1/tickets`)
    .set("Cookie", global.signIn())
    .send({
      title: "Fake Title",
      price: 40.0,
    })
    .expect(201);

  return request(app)
    .delete(`/api/v1/tickets/${response.body.id}`)
    .send()
    .expect(401);
});

it("Returns a 401 if user is not authorized to delete the ticket", async () => {
  const response = await request(app)
    .post(`/api/v1/tickets`)
    .set("Cookie", global.signIn())
    .send({
      title: "Fake Title",
      price: 40.0,
    })
    .expect(201);

  return request(app)
    .delete(`/api/v1/tickets/${response.body.id}`)
    .set("Cookie", global.signIn())
    .send()
    .expect(401);
});

it("Returns a 404 if the ID is incorrect", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const cookie = global.signIn();

  const response = await request(app)
    .post(`/api/v1/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "Fake Title",
      price: 40.0,
    })
    .expect(201);

  return request(app)
    .delete(`/api/v1/tickets/${id}`)
    .set("Cookie", cookie)
    .send()
    .expect(404);
});

it("Deletes a ticket entry by the supplied ID", async () => {
  const cookie = global.signIn();

  const response = await request(app)
    .post(`/api/v1/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "Fake Title",
      price: 40.0,
    })
    .expect(201);

  return request(app)
    .delete(`/api/v1/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(204);
});
