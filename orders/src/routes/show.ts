import express, { Request, Response } from "express";
import { Order } from "../models/order.model";
import {
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from "@parkerco/common";

const router = express.Router();

router.get(
  "/api/v1/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const orderId = req.params.orderId;
    const fetchedOrder = await Order.findById(orderId).populate("ticket");

    if (!fetchedOrder) {
      throw new NotFoundError();
    }
    if (fetchedOrder.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    res.send(fetchedOrder);
  }
);

export { router as showOrderRouter };
