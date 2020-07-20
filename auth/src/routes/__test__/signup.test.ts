import request from "supertest";
import { app } from "../../app";

it("Returns 201 after successful signup", async () => {
  return request(app)
    .post("/api/v1/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});
