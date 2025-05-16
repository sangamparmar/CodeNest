import request from "supertest";
import mongoose from "mongoose";
import { app, server } from "../src/server";

describe("Server API Endpoints", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || "", {});
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  test("should not register a user with an existing email", async () => {
    const res = await request(app)
      .post("/register")
      .send({ username: "testuser", email: "test@example.com", password: "password123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  test("should login a user", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

});