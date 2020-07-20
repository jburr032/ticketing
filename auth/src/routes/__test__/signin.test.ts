import request from "supertest";
import { app } from "../../app";

it("Fails when an email that does not exist is provided", async () => {
  await request(app)
    .post("/api/v1/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("Fails when an incorrect password is provided", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/v1/users/signin")
    .send({
      email: "test@test.com",
      password: "pass",
    })
    .expect(400);
});

it("Responds with a cookie when valid creds are provided", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/v1/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
