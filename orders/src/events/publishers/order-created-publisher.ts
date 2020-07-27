import { Publisher, OrderCreated, Subjects } from "@parkerco/common";

export class OrderCreatedPublisher extends Publisher<OrderCreated> {
  readonly subject = Subjects.OrderCreated;
}
