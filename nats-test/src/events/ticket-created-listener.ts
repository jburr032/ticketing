import { Message } from "node-nats-streaming";

import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-events";
import { Subjects } from "./subjects";

export default class TicketCreatedListener extends Listener<
  TicketCreatedEvent
> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("Event data!", data);

    console.log(data.id);
    console.log(data.title);
    console.log(data.price);
    msg.ack();
  }
}
