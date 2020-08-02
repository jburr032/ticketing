import { Message } from "node-nats-streaming";

import { Listener } from "./base-listener";
import { Subjects } from "./subjects";
import { OrderCreatedEvent } from "./order-created-events";

export default class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = "payments-service";

  onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    msg.ack();
  }
}
