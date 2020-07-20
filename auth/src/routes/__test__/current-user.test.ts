import request from "supertest";
import { app } from "../../app";

it("Verify user's email on response", async () => {
  const cookie = await global.signIn();

  const response = await request(app)
    .get("/api/v1/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("Verify currentUser is null with no authentication", async () => {
  const response = await request(app)
    .get("/api/v1/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
