import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { API_URL } from "../config";

const useAuth = () => {
  const {
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();

  useEffect(() => {
    const saveUserToDB = async () => {
      if (!user) return;

      try {
        const response = await fetch(`${API_URL}/profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            sub: user.sub,
          }),
        });

        const data = await response.json();
        console.log("User saved to DB:", data);
      } catch (error) {
        console.error("Error saving user:", error);
      }
    };

    if (isAuthenticated && user) {
      saveUserToDB();
    }
  }, [isAuthenticated, user]);

  return {
    login: loginWithRedirect,
    logout: () => logout({ returnTo: window.location.origin }),
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
  };
};

export default useAuth;
