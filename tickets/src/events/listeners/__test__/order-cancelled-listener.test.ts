import mongoose from "mongoose";
import { OrderCreated, Subjects, OrderCancelled } from "@parkerco/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket.model";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { OrderCreatedListener } from "../order-created-listener";

const setUp = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "Concert",
    price: 100,
    userId: mongoose.Types.ObjectId().toHexString(),
  });
  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelled["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, msg };
};

it("Checks that order ID has been set to undefined", async () => {
  const { listener, data, ticket, msg } = await setUp();

  await listener.onMessage(data, msg);

  // Check that order ID is now undefined
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).toBeUndefined();
});

it("Checks that ack() was called", async () => {
  const { listener, data, msg } = await setUp();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("Checks that ticketUpdated.publish() was called", async () => {
  const { listener, ticket, data, msg } = await setUp();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
