import { Publisher, OrderCancelled, Subjects } from "@parkerco/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelled> {
  readonly subject = Subjects.OrderCancelled;
}
