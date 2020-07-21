import { useState } from "react";

import useRequest from "../../hooks/request-hook";

export default () => {
  const [userCreds, setCreds] = useState({
    email: "",
    password: "",
  });

  const { email, password } = userCreds;

  const { doRequest, errors } = useRequest({
    url: "/api/v1/users/signup",
    method: "post",
    body: {
      email,
      password,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCreds({ ...userCreds, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    doRequest();
  };

  return (
    <div className='container' style={{ margin: "30px auto" }}>
      <form onSubmit={onSubmit}>
        <h1 className='sign-up-header'>Sign Up</h1>
        <div className='form-group'>
          <label>Email address</label>
          <input
            className='form-control'
            name='email'
            value={email}
            onChange={handleChange}
          />
        </div>
        <div className='form-group'>
          <label>Password</label>
          <input
            type='password'
            className='form-control'
            name='password'
            value={password}
            onChange={handleChange}
          />
        </div>
        {errors}
        <button className='btn-primary'>Sign Up</button>
      </form>
    </div>
  );
};
