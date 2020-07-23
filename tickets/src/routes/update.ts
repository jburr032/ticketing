import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  // Middleware
  requireAuth,
  validateRequest,
  // Errors
  NotAuthorizedError,
  NotFoundError,
} from "@parkerco/common";
import { Ticket } from "../models/ticket.model";

const router = express.Router();

router.put(
  "/api/v1/tickets/:id",
  requireAuth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,

  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId != req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const title = req.body.title;
    const price = req.body.price;
    ticket.set({ title, price });
    await ticket.save();

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
