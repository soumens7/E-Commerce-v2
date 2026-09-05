import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const registerSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/user/register`, { ...user });

      localStorage.setItem("refresh_token", res.data.refreshToken);

      localStorage.setItem("firstLogin", true);
      window.location.href = "/";
      console.log(user);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };
  return (
    <div className="register-page">
      <form onSubmit={registerSubmit}>
        <input
          type="text"
          name="name"
          required
          placeholder="Name"
          value={user.name}
          onChange={onChangeInput}
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          value={user.email}
          onChange={onChangeInput}
        />
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
          value={user.password}
          onChange={onChangeInput}
        />
        <div className="row">
          <button type="submit">Register </button>
          <Link to="/login"> Login</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
