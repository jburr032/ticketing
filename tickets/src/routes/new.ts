// Route handler to create new ticket
import express, { Request, Response, request } from "express";
import { requireAuth, validateRequest } from "@parkerco/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket.model";

const route = express.Router();

route.post(
  "/api/v1/tickets",
  requireAuth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });
    await ticket.save();

    res.status(201).send(ticket);
  }
);

export { route as createTicketRouter };
