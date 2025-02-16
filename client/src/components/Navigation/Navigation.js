import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ProfileImage from "../Profile/ProfileImage";

export default function Navigation({ toggleModal, user }) {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <nav style={{ display: "flex", justifyContent: "flex-end" }}>
      {isAuthenticated ? (
        <>
          <ProfileImage
            toggleModal={toggleModal}
            userImage={user?.profileImage}
          />
          <button
            onClick={() => logout({ returnTo: window.location.origin })}
            className="f3 link rounded dim pa3 pointer"
            aria-label="Sign out"
          >
            Sign Out
          </button>
        </>
      ) : (
        <button
          onClick={() => loginWithRedirect()}
          className="f3 link rounded dim pa3 pointer"
          aria-label="Sign in"
        >
          Sign In
        </button>
      )}
    </nav>
  );
}
