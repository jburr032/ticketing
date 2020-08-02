import { Publisher, PaymentCreatedEvent, Subjects } from "@parkerco/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
