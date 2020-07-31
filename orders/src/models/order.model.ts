import mongoose from "mongoose";
import { OrderStatus } from "@parkerco/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

import { TicketDoc } from "./ticket.model";

export { OrderStatus };

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}
interface OrderDoc extends mongoose.Document {
  userId: string;
  version: number;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      required: true,
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);
// Assign static method to ticketSchema instance
// Static method is a wrapper to enforce types
orderSchema.statics.build = (orderAttrs: OrderAttrs) => new Order(orderAttrs);

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
