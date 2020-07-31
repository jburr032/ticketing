import queueGroupName from "./queue-group-names";
import { Ticket } from "../../models/ticket.model";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

import { Message } from "node-nats-streaming";
import {
  OrderCancelled,
  Listener,
  Subjects,
  NotFoundError,
} from "@parkerco/common";

export class OrderCancelledListener extends Listener<OrderCancelled> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelled["data"], msg: Message) {
    const { ticket } = data;

    const fetchedTicket = await Ticket.findById(ticket.id);

    if (!fetchedTicket) {
      throw new NotFoundError();
    }

    fetchedTicket.set({ orderId: undefined });
    await fetchedTicket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: fetchedTicket.id,
      version: fetchedTicket.version,
      title: fetchedTicket.id,
      price: fetchedTicket.price,
      userId: fetchedTicket.userId,
      orderId: fetchedTicket.orderId,
    });

    msg.ack();
  }
}
