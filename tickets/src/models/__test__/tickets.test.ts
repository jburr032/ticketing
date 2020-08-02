import request from "supertest";
import { Ticket } from "../ticket.model";
import mongoose from "mongoose";

it("Tests optimistic concurrency control", async (done) => {
  // Create a ticket
  const ticket = Ticket.build({
    title: "BSB concert",
    price: 200.0,
    userId: mongoose.Types.ObjectId().toHexString(),
  });

  // Save it to the DB
  await ticket.save();

  // Fetch ticket twice
  const ticket1 = await Ticket.findById(ticket.id);
  const ticket2 = await Ticket.findById(ticket.id);

  // Make two separate changes to the tickets we fetched
  ticket1!.set({
    title: "Nsync concert",
    price: "3000",
  });

  ticket2!.set({
    title: "Nsync concert",
    price: "5000",
  });
  // Save the first fetch ticket
  await ticket1!.save();

  // Save the second and expect an err
  try {
    await ticket2!.save();
  } catch (err) {
    return done();
  }

  throw new Error("Test should not have reached this point");
});

it("Verify that version numbers have been incremented", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: "BSB concert",
    price: 200.0,
    userId: "1234",
  });

  await ticket.save();
  console.log(ticket);
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
