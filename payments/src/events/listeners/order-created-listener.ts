import { Listener, Subjects, OrderCreated } from "@parkerco/common";
import queueGroupName from "./queue-group-name";
import { Message } from "node-nats-streaming";

import { Order } from "../../models/order.model";

export class OrderCreatedListener extends Listener<OrderCreated> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreated["data"], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });

    await order.save();

    msg.ack();
  }
}
