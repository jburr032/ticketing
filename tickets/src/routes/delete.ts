import express, { Request, Response } from "express";
import body from "express-validator";
import {
  // Middleware
  requireAuth,
  // Errors
  NotAuthorizedError,
  NotFoundError,
  currentUser,
} from "@parkerco/common";
import { Ticket } from "../models/ticket.model";

const router = express.Router();

router.delete(
  "/api/v1/tickets/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId != req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    await Ticket.deleteOne({ _id: req.params.id });

    res.status(204).send({});
  }
);

export { router as deleteTicketRouter };
