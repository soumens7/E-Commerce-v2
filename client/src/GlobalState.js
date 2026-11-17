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

  useEffect(() => {
    const restoreSession = async () => {
      const firstLogin = localStorage.getItem("firstLogin");

      if (!firstLogin) return;

      try {
        console.log("Attempting to restore session...");

        // Browser sends the HttpOnly refresh cookie automatically.
        const res = await axios.post("/user/refresh_token");

        if (res.data.accessToken) {
          setToken(res.data.accessToken);
          localStorage.setItem("access_token", res.data.accessToken);
        } else {
          setToken(false);
          localStorage.removeItem("firstLogin");
          localStorage.removeItem("access_token");
        }
      } catch (error) {
        console.error("Session restoration failed:", {
          status: error.response?.status,
          response: error.response?.data,
          message: error.message,
        });

        setToken(false);
        localStorage.removeItem("access_token");

        // A 401 means the refresh cookie is missing, invalid or expired.
        if (error.response?.status === 401) {
          localStorage.removeItem("firstLogin");
        }
      }
    };

    restoreSession();
  }, []);
  const state = {
    token: [token, setToken],
    productsAPI: ProductAPI(token),
    userAPI: UserAPI(token),
  };

  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
