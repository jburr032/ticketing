import { Publisher, Subjects, TicketCreatedEvent } from "@parkerco/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  // Can also have: readonly subject
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
