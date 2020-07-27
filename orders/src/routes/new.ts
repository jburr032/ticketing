import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import {
  requireAuth,
  NotAuthorizedError,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
  Subjects,
} from "@parkerco/common";
import { Ticket } from "../models/ticket.model";
import { Order } from "../models/order.model";
import { natsWrapper } from "../nats-wrapper";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";

const router = express.Router();

const EXPIRATON_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/v1/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Must provide a valid Ticket ID"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      console.log(ticket);
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError("Ticket is unavailable");
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATON_WINDOW_SECONDS);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Completed,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    // Publish OrderCreated event
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
