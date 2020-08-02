import React, { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import Router from "next/router";

import useRequest from "../../hooks/request-hook";

const OrderPage = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState("");

  const { doRequest, errors } = useRequest({
    url: "/api/v1/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order expired</div>;
  }

  return (
    <div>
      Time left to pay {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey='pk_test_51GwnzFBAro3M03KjR0Gg22iH70i7q9YLfTZadt1NOCnG2Q6a4ZRoCdwFyVzFdMPzyJSHQs2w81p7nIVyJ4J1F4pj00PZT0GSEs'
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderPage.getInitialProps = async (context, client) => {
  const { orderId } = context.query;

  const { data } = await client.get(`/api/v1/orders/${orderId}`);

  return { order: data };
};

export default OrderPage;
