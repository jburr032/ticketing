import { Listener, Subjects, TicketUpdatedEvent } from "@parkerco/common";
import { Message } from "node-nats-streaming";

import { Ticket } from "../../models/ticket.model";
import queueGroupName from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const updatedTicket = await Ticket.findByEvent(data);

    if (!updatedTicket) {
      throw new Error("Ticket not found");
    }

    const { title, price } = data;
    updatedTicket.set({ title, price });
    await updatedTicket.save();

    msg.ack();
  }
}
