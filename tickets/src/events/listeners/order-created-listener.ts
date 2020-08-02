import {
  Listener,
  OrderCreated,
  Subjects,
  NotFoundError,
} from "@parkerco/common";
import queueGroupName from "./queue-group-names";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket.model";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreated> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreated["data"], msg: Message) {
    const { ticket, id } = data;

    const fetchedTicket = await Ticket.findById(ticket.id);

    if (!fetchedTicket) {
      throw new NotFoundError();
    }

    fetchedTicket.set({ orderId: id });

    await fetchedTicket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: fetchedTicket.id,
      version: fetchedTicket.version,
      title: fetchedTicket.title,
      price: fetchedTicket.price,
      userId: fetchedTicket.userId,
      orderId: fetchedTicket.orderId,
    });

    msg.ack();
  }
}
