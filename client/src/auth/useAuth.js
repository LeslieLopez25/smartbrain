import { useAuth0 } from "@auth0/auth0-react";

const useAuth = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
    useAuth0();

  const saveUserToDB = async (user) => {
    if (!user) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          sub: user.sub, // Send the Auth0 user ID
        }),
      });

      const data = await response.json();
      console.log("User saved to DB:", data);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // Call saveUserToDB when user logs in
  if (isAuthenticated && user) {
    saveUserToDB(user);
  }

  return {
    login: () => loginWithRedirect(),
    logout: () => logout({ returnTo: window.location.origin }),
    user,
    isAuthenticated,
    isLoading,
  };
};

export default useAuth;
