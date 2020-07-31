import { OrderStatus } from "@parkerco/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// Fields required to creat a payments record
interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: string;
}

interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: string;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(paymentsAttrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: OrderStatus,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        (ret.id = ret._id), delete ret._id;
      },
    },
  }
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

// Assign static method to ticketSchema instance
// Static method is a wrapper to enforce types
orderSchema.statics.build = (orderAttrs: OrderAttrs) =>
  new Order({
    _id: orderAttrs.id,
    version: orderAttrs.version,
    price: orderAttrs.price,
    userId: orderAttrs.userId,
    status: orderAttrs.status,
  });

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
