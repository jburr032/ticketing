import { useState } from "react";
import Router from "next/router";

import useRequest from "../../hooks/request-hook";

const NewTicket = () => {
  const [ticketDetails, setTicketDetails] = useState({
    title: "",
    price: 0.0,
  });
  const { title, price } = ticketDetails;

  const { doRequest, errors } = useRequest({
    url: "/api/v1/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: (ticket) => Router.push("/"),
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setTicketDetails({ ...ticketDetails, [name]: value });
  };

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setTicketDetails({ ...ticketDetails, price: value.toFixed(2) });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    doRequest();
  };

  return (
    <div>
      <h1>Create a Ticket</h1>

      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Title</label>
          <input
            name='title'
            value={title}
            onChange={handleChange}
            className='form-control'
          />
        </div>
        <div className='form-group'>
          <label>Price</label>
          <input
            name='price'
            value={price}
            onChange={handleChange}
            className='form-control'
            onBlur={onBlur}
          />
        </div>
        {errors}
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
