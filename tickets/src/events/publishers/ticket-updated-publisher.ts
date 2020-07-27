import { TicketUpdatedEvent, Subjects, Publisher } from "@parkerco/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
