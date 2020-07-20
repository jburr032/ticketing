import request from "supertest";
import { app } from "../../app";

it("Returns 200 with successul signup", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

// WORKING
it("Returns 400 with invalid email", async () => {
  return request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test.com",
      password: "passowrd",
    })
    .expect(400);
});

// WORKING
it("Returns 400 with invalid password", async () => {
  return request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "",
    })
    .expect(400);
});

// WORKING
it("Returns 400 with incomplete email and passowrd", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
    })
    .expect(400);

  return request(app)
    .post("/api/v1/users/signup")
    .send({
      password: "testtestcom",
    })
    .expect(400);
});

it("Returns 400 with duplicate email signup", async () => {
  await request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("Checks that a cookie has been set", async () => {
  const response = await request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
