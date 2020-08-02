import { ExpirationCompletedListener } from "../listeners/expiration-completed-listener";
import { natsWrapper } from "../../nats-wrapper";
import { Order } from "../../models/order.model";
import { Ticket } from "../../models/ticket.model";

import { ExpirationCompletedEvent, OrderStatus } from "@parkerco/common";
import mongoose from "mongoose";

const setUp = async () => {
  const listener = new ExpirationCompletedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Concert ticket",
    price: 100,
  });
  await ticket.save();

  const order = Order.build({
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompletedEvent["data"] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it("Check that order status has been set to cancelled after receiving event", async () => {
  const { listener, data, msg, order } = await setUp();

  await listener.onMessage(data, msg);

  const cancelledOrder = await Order.findById(order._id);

  expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);
});
