import { auth0 } from "@auth0/auth0-react";

export const loginWithRedirect = (loginWithRedirect) => {
  return loginWithRedirect();
};

export const logout = (logout) => {
  return logout({ returnTo: window.location.origin });
};

export const getUser = (user) => {
  return user;
};
