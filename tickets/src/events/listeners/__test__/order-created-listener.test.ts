import mongoose from "mongoose";
import { OrderCreated, Subjects } from "@parkerco/common";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket.model";

const setUp = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: "Concert",
    price: 100,
    userId: mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const data: OrderCreated["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: Subjects.OrderCreated,
    userId: ticket.userId,
    expiresAt: new Date().toString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, msg };
};

it("Checks that the userID has been set to the order ID on the order record", async () => {
  const { listener, data, ticket, msg } = await setUp();

  await listener.onMessage(data, msg);

  const reservedTicket = await Ticket.findById(ticket!.id);
  expect(reservedTicket!.orderId).toEqual(data.id);
});

it("Check that ack() is called", async () => {
  const { listener, data, ticket, msg } = await setUp();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("Check that a ticket updated event has been published using .publish inside the listener", async () => {
  const { listener, data, ticket, msg } = await setUp();
  await listener.onMessage(data, msg);

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(ticketUpdatedData.orderId).toEqual(data.id);
});
