import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Listener, TicketUpdatedEvent } from "@parkerco/common";
import { TicketCreatedListener } from "../listeners/ticket-created-listener";

import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket.model";
import { TicketUpdatedListener } from "../listeners/ticket-updated-listener";

const setUp = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Concert ticket",
    price: 100,
  });
  await ticket.save();

  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "Second concert ticket",
    price: 990,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("updates and saves a ticket", async () => {
  const { listener, data, msg, ticket } = await setUp();

  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
});

it("check that acks() was called", async () => {
  const { listener, data, msg } = await setUp();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("Checks ack() is not called if versions are out of order", async () => {
  const { listener, msg, data, ticket } = await setUp();

  data.version = 10;
  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
