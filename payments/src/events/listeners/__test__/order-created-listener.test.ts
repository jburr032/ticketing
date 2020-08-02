import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Subjects, OrderStatus, OrderCreated } from "@parkerco/common";
import { Order } from "../../../models/order.model";

const setUp = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreated["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: "kjkdjs",
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
      price: 100,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, msg, data };
};

it("Checks that the listener can process order events", async () => {
  const { listener, msg, data } = await setUp();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.id).toEqual(data.id);
  expect(order!.price).toEqual(data.ticket.price);
  expect(order!.status).toEqual(data.status);
  expect(order!.userId).toEqual(data.userId);

  expect(msg.ack).toHaveBeenCalled();
});
