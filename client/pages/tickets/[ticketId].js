import React from "react";

import useRequest from "../../hooks/request-hook";
import Router from "next/router";

const TicketPage = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/v1/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });
  console.log("THE TICKET", ticket);
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>{ticket.price}</h4>
      {errors}
      <button onClick={() => doRequest()} className='btn btn-primary'>
        Purchase
      </button>
    </div>
  );
};

TicketPage.getInitialProps = async (context, client) => {
  // Get the name of the variable in the request params
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/v1/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketPage;
