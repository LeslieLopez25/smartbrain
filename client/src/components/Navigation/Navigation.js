import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ProfileImage from "../Profile/ProfileImage";

export default function Navigation({ toggleModal }) {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <nav style={{ display: "flex", justifyContent: "flex-end" }}>
      {isAuthenticated ? (
        <ProfileImage toggleModal={toggleModal} />
      ) : (
        <>
          <p
            onClick={() => loginWithRedirect()}
            className="f3 link dim white underline pa3 pointer"
          >
            Sign In
          </p>
        </>
      )}
    </nav>
  );
}
