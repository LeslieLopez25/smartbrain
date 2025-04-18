import React, { useState, useEffect, Suspense, lazy } from "react";
import ParticlesBg from "particles-bg";
import LoadingScreen from "react-loading-screen";
import Modal from "./components/Modal/Modal";
import Profile from "./components/Profile/Profile";
import { useAuth0 } from "@auth0/auth0-react";
import { API_URL } from "./config";
import "./App.css";

const FaceRecognition = lazy(() =>
  import("./components/FaceRecognition/FaceRecognition")
);
const Navigation = lazy(() => import("./components/Navigation/Navigation"));
const Logo = lazy(() => import("./components/Logo/Logo"));
const ImageLinkForm = lazy(() =>
  import("./components/ImageLinkForm/ImageLinkForm")
);
const Rank = lazy(() => import("./components/Rank/Rank"));

const initialState = {
  input: "",
  imageUrl: "",
  boxes: [],
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
    pet: "",
    age: "",
    profile_image: "",
  },
};

export default function App() {
  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
    user: auth0User,
    isLoading,
  } = useAuth0();

  const [state, setState] = useState(initialState);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && auth0User) {
      const saveUserToDB = async () => {
        try {
          const response = await fetch(`${API_URL}/auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              auth0_id: auth0User.sub,
              name: auth0User.name,
              email: auth0User.email,
            }),
          });

          if (!response.ok) {
            const text = await response.text();
            throw new Error(`Failed to save user to DB: ${text}`);
          }
          const dbUser = await response.json();

          if (dbUser.id) {
            setState((prevState) => ({
              ...prevState,
              user: {
                ...prevState.user,
                ...dbUser,
              },
            }));
          }
        } catch (error) {
          console.error("Failed to save user to DB:", error);
        }
      };

      saveUserToDB();
    }
  }, [isAuthenticated, auth0User]);

  const calculateFaceLocation = (data) => {
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return data.outputs[0].data.regions.map((face) => {
      const clarifaiFace = face.region_info.bounding_box;
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - clarifaiFace.right_col * width,
        bottomRow: height - clarifaiFace.bottom_row * height,
      };
    });
  };

  const displayFaceBox = (boxes) => {
    setState((prevState) => ({ ...prevState, boxes }));
  };

  const onInputChange = (event) => {
    setState((prevState) => ({ ...prevState, input: event.target.value }));
  };

  const onButtonSubmit = () => {
    setState((prevState) => ({
      ...prevState,
      imageUrl: prevState.input,
    }));

    fetch(`${API_URL}/imageurl`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: state.input,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          fetch(`${API_URL}/image`, {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: state.user.id,
            }),
          })
            .then((res) => res.json())
            .then((count) => {
              console.log("Count response:", count);
              setState((prevState) => ({
                ...prevState,
                user: {
                  ...prevState.user,
                  entries: count,
                },
              }));
            })
            .catch(console.log);
        }
        displayFaceBox(calculateFaceLocation(response));
      })
      .catch((err) => console.log(err));
  };

  const toggleModal = () => {
    setIsProfileOpen((prevState) => !prevState);
  };

  const { imageUrl, boxes, user } = state;

  if (isLoading) {
    return (
      <LoadingScreen
        loading={true}
        bgColor="transparent"
        spinnerColor="#ffffff"
        textColor="#ffffff"
        text="Loading..."
      />
    );
  }

  return (
    <div className="App">
      <ParticlesBg
        class="particles-bg-canvas-self"
        type="thick"
        bg={{
          position: "fixed",
          height: "100%",
          width: "100%",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: -1,
        }}
      />

      <Suspense
        fallback={
          <LoadingScreen
            loading={true}
            bgColor="transparent"
            spinnerColor="#ffffff"
            textColor="#ffffff"
            text="Loading..."
          />
        }
      >
        <Navigation
          isSignedIn={isAuthenticated}
          loginWithRedirect={loginWithRedirect}
          logout={logout}
          toggleModal={toggleModal}
        />

        {isProfileOpen && (
          <Modal>
            <Profile
              isProfileOpen={isProfileOpen}
              toggleModal={toggleModal}
              user={user}
            />
          </Modal>
        )}

        {isAuthenticated ? (
          <div>
            <Logo />
            <Rank name={user.name} entries={user.entries} />
            <ImageLinkForm
              onInputChange={onInputChange}
              onButtonSubmit={onButtonSubmit}
            />
            <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
          </div>
        ) : (
          <div className="text-white text-center mt-20">
            <h2 className="text-2xl font-bold">Welcome!</h2>
            <p className="mb-4">Please sign in to use the app.</p>
            <button
              onClick={loginWithRedirect}
              className="bg-blue-500 px-6 py-2 rounded hover:bg-blue-600"
            >
              Sign In
            </button>
          </div>
        )}
      </Suspense>
    </div>
  );
}
