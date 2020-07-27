import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect("ticketing", "555", { url: "http://localhost:4222" });

stan.on("connect", async () => {
  console.log("Publisher connected via NATS");

  const publisher = new TicketCreatedPublisher(stan);

  try {
    await publisher.publish({
      id: "123",
      title: "Concert",
      price: 100,
    });
  } catch (err) {
    console.error(err);
  }

  // const data = JSON.stringify({
  //   id: "123",
  //   title: "Concert",
  //   price: 10,
  // });

  // stan.publish("ticket:created", data, () => {
  //   console.log("Event published");
  // });
});
