import {
  ExpirationCompletedEvent,
  Subjects,
  Listener,
  OrderStatus,
} from "@parkerco/common";

import { Order } from "../../models/order.model";
import queueGroupName from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompletedListener extends Listener<
  ExpirationCompletedEvent
> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompletedEvent["data"], msg: Message) {
    const fetchedOrder = await Order.findById(data.orderId).populate("ticket");

    if (!fetchedOrder) {
      throw new Error("Order not found");
    }

    if (fetchedOrder.status === OrderStatus.Completed) {
      return msg.ack();
    }

    fetchedOrder.set({ status: OrderStatus.Cancelled });
    await fetchedOrder.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: fetchedOrder.id,
      version: fetchedOrder.version,
      ticket: {
        id: fetchedOrder.ticket.id,
      },
    });

    msg.ack();
  }
}
