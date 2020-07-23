import request from "supertest";
import { app } from "../../app";

const createTickets = () => {
  return request(app)
    .post("/api/v1/tickets")
    .set("Cookie", global.signIn())
    .send({ title: "Concert", price: 10 });
};

it("Returns the index of all of the tickets", async () => {
  // Create three tickets in the DB
  await createTickets();
  await createTickets();
  await createTickets();

  // Check if length of tickets array is 3
  const response = await request(app).get("/api/v1/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});
