import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import {
  TicketCreatedEvent,
  Listener,
  TicketUpdatedEvent,
} from "@parkerco/common";
import { TicketCreatedListener } from "../../events/listeners/ticket-created-listener";

import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket.model";

const setUp = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);

  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: "Concert ticket",
    price: 100,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = await setUp();

  await listener.onMessage(data, msg);
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("check that acks() was called", async () => {
  const { listener, data, msg } = await setUp();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
