import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ProfileImage from "../Profile/ProfileImage";

export default function Navigation({ toggleModal, user }) {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <nav style={{ display: "flex", justifyContent: "flex-end" }}>
      {isAuthenticated ? (
        <ProfileImage toggleModal={toggleModal} user={user} />
      ) : (
        <>
          <button
            onClick={() => loginWithRedirect()}
            className="f5 b mt-4 mr3 grow no-underline br-pill ba bw1 ph3 pv2 mb2 dib lightest-blue bg-transparent hover-bg-light-blue hover-light-green pointer"
          >
            Sign In
          </button>
        </>
      )}
    </nav>
  );
}
