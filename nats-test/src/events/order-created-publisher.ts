import { Publisher } from "./base-publisher";
import { OrderCreatedEvent } from "./order-created-events";
import { Subjects } from "./subjects";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
