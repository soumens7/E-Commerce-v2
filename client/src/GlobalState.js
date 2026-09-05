import React, { createContext, useEffect, useState } from "react";
import ProductAPI from "./API/ProductAPI";
import axios from "axios";
import UserAPI from "./API/UserAPI";

export const GlobalState = createContext();

axios.defaults.baseURL =
  process.env.REACT_APP_API_URL || "http://localhost:4000";
axios.defaults.withCredentials = true;

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false);

  const refreshToken = async () => {
    try {
      console.log("Attempting to refresh token...");
      const refreshToken = localStorage.getItem("refresh_token");
      const res = await axios.post(
        "/user/refresh_token",
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
          // withCredentials is now set by defaults
        }
      );

      console.log("Refresh token response:", res.data);
      if (res.data.accessToken) {
        setToken(res.data.accessToken); // Set token state to the new access token
        localStorage.setItem("access_token", res.data.accessToken); // Store access token in local storage
      } else {
        localStorage.removeItem("firstLogin"); // Remove firstLogin if no access token
        setToken(false); // Set token to false if no access token is received
      }
    } catch (error) {
      console.error("Refresh token error:", {
        message: error.message,
        response: error.response?.data,
        config: error.config,
      });
      localStorage.removeItem("firstLogin"); // Remove firstLogin if there's an error
      setToken(false);
    }
  };

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      if (!token) refreshToken();
    }
  }, [token]); // Remove token from dependency to prevent infinite loop

  const state = {
    token: [token, setToken],
    productsAPI: ProductAPI(token),
    userAPI: UserAPI(token),
  };

  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
