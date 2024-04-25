import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const LogoutButton = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    const logoutHandler = async () =>
    {
      const response = await axios.post(`${import.meta.env.VITE_HOST_URL}/api/v1/user/emptySocket`,{"email":user?.email},{
        "Content-Type":"application/json",
      });
    }

  const { logout } = useAuth0();
  
  return (
    <button className="btn btn-outline-danger" onClick={() => {logoutHandler();logout({ logoutParams: { returnTo: window.location.origin } })}}>
      Log Out
    </button>
  );
};

export default LogoutButton;