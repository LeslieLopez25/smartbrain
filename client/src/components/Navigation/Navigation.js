import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ProfileImage from "../Profile/ProfileImage";
import { API_URL } from "../../config";

export default function Navigation({ toggleModal }) {
  const { isAuthenticated, loginWithRedirect, user: auth0User } = useAuth0();
  const [dbUser, setDbUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (auth0User && auth0User.sub) {
        try {
          const encodedSub = encodeURIComponent(auth0User.sub);
          const res = await fetch(`${API_URL}/users/${encodedSub}`);
          const data = await res.json();

          if (res.ok) {
            setDbUser(data);
          } else {
            console.log("Failed to fetch user:", data);
          }
        } catch (error) {
          console.error("Error fetching user from DB:", error);
        }
      }
    };

    fetchUser();
  }, [auth0User]);

  return (
    <nav style={{ display: "flex", justifyContent: "flex-end" }}>
      {isAuthenticated ? (
        <ProfileImage toggleModal={toggleModal} user={dbUser} />
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
