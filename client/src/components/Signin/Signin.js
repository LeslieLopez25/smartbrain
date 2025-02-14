import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoadingScreen from "react-loading-screen";
import BASE_URL from "../../config";

import "./Signin.css";

export default function Signin() {
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();

  return (
    <LoadingScreen
      loading={isLoading}
      bgColor="transparent"
      spinnerColor="#ffffff"
      textColor="#ffffff"
      text="Loading..."
    >
      <article className="br3 ba b--black-40 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 white">
          <div className="measure">
            <legend className="f1 fw6 ph0 mh0 center">Sign In</legend>

            {!isAuthenticated ? (
              <button
                onClick={() => loginWithRedirect()}
                className="b ph3 pv2 input-reset ba b--white white bg-transparent grow pointer f6 dib"
              >
                Sign In with Auth0
              </button>
            ) : (
              <button
                onClick={() =>
                  logout({
                    returnTo:
                      process.env.REACT_APP_BASE_URL || window.location.origin,
                  })
                }
                className="b ph3 pv2 input-reset ba b--white white bg-transparent grow pointer f6 dib"
              >
                Logout
              </button>
            )}
          </div>
        </main>
      </article>
    </LoadingScreen>
  );
}
