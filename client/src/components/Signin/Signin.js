import React, { useState } from "react";
import LoadingScreen from "react-loading-screen";
import "./Signin.css";

export default function Signin({ loadUser, onRouteChange }) {
  const [signInData, setSignInData] = useState({
    signInEmail: "",
    signInPassword: "",
    loading: false,
  });

  const { signInEmail, signInPassword, loading } = signInData;

  const onEmailChange = (event) => {
    setSignInData({ ...signInData, signInEmail: event.target.value });
  };

  const onPasswordChange = (event) => {
    setSignInData({ ...signInData, signInPassword: event.target.value });
  };

  const onSubmitSignIn = () => {
    setSignInData((prev) => ({ ...prev, loading: true }));

    fetch("https://smartbrain-api-2mk1.onrender.com/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
      }),
    })
      .then((response) => response.json())
      .then((user) => {
        setSignInData((prev) => ({ ...prev, loading: false }));

        if (user.id) {
          loadUser(user);
          onRouteChange("home");
        } else {
          alert("Invalid credentials. Please try again.");
        }
      })
      .catch((err) => {
        setSignInData((prev) => ({ ...prev, loading: false }));
        console.error("Signin error:", err);
        alert("Something went wrong. Please try again later.");
      });
  };

  return (
    <LoadingScreen
      loading={loading}
      bgColor="transparent"
      spinnerColor="#ffffff"
      textColor="#ffffff"
      logoSrc=""
      text="Loading..."
      className="text-xl w-fit mx-auto backdrop-blur-sm"
    >
      <article className="br3 ba b--black-40 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 white">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0 center">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black"
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange={onEmailChange}
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password
                </label>
                <input
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 hover-black"
                  type="password"
                  name="password"
                  id="password"
                  onChange={onPasswordChange}
                />
              </div>
            </fieldset>
            <div className="">
              <input
                onClick={onSubmitSignIn}
                className="b ph3 pv2 input-reset ba b--black white bg-transparent grow pointer f6 dib"
                type="submit"
                value="Sign In"
              />
            </div>
            <div className="lh-copy mt3">
              <p
                onClick={() => onRouteChange("register")}
                className="f6 link dim white db pointer"
              >
                Register
              </p>
            </div>
          </div>
        </main>
      </article>
    </LoadingScreen>
  );
}
