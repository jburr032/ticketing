import express, { Request, Response } from "express";
import { requireAuth } from "@parkerco/common";
import { Order } from "../models/order.model";

const router = express.Router();

router.get(
  "/api/v1/orders",
  requireAuth,
  async (req: Request, res: Response) => {
    const orders = await Order.find({
      userId: req.currentUser!.id,
      // .populate() adds the referenced docs to the returned value
    }).populate("ticket");

    res.send(orders);
  }
);

export { router as indexOrderRouter };
