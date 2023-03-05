import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
const ProtectedRoute = ({ children }) => {
  const { userLogged } = useUserAuth();

  console.log("Check user in Private: ", userLogged);
  if (!userLogged) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
