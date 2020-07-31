import {
  PaymentCreatedEvent,
  Listener,
  Subjects,
  OrderStatus,
} from "@parkerco/common";

import { Order } from "../../models/order.model";
import queueGroupName from "./queue-group-name";
import { Message } from "node-nats-streaming";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(data.id);

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({ status: OrderStatus.Completed });
    await order?.save();

    msg.ack();
  }
}
