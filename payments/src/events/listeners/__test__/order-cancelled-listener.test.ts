import { OrderCancelledListener } from "../order-cancelled-listener";
import { Order } from "../../../models/order.model";

import { natsWrapper } from "../../../nats-wrapper";
import { OrderStatus, OrderCancelled, Subjects } from "@parkerco/common";
import mongoose from "mongoose";

const setUp = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: "khkjhk",
    price: 100,
    status: OrderStatus.Created,
  });
  await order.save();

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  const data: OrderCancelled["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: "fdfd",
    },
  };

  return { listener, order, msg, data };
};

it("Check that order-cancelled listener update the order record", async () => {
  const { listener, order, msg, data } = await setUp();

  await listener.onMessage(data, msg);

  const fetchedOrder = await Order.findById(order.id);

  expect(fetchedOrder!.status).toEqual(OrderStatus.Cancelled);
  expect(msg.ack).toHaveBeenCalled();
});
