import React, { useState, Suspense, lazy, useEffect } from "react";
import ParticlesBg from "particles-bg";
import LoadingScreen from "react-loading-screen";
import Modal from "./components/Modal/Modal";
import Profile from "./components/Profile/Profile";
import AuthProvider from "./auth/auth0Provider";
import useAuth from "./auth/useAuth";
import axios from "axios";
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

export default function App() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
    useAuth();
  const [imageUrl, setImageUrl] = useState("");
  const [boxes, setBoxes] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [entries, setEntries] = useState(0);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently();
          const response = await axios.get(`${API_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserData(response.data);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  // Function to calculate face location from API response
  const calculateFaceLocation = (data) => {
    const image = document.getElementById("inputimage");
    if (!image) return [];

    const width = Number(image.width);
    const height = Number(image.height);

    if (!data.outputs || !data.outputs[0].data.regions) {
      return [];
    }

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

  const onInputChange = (event) => {
    setImageUrl(event.target.value);
  };

  const onImageSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/imageurl`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: imageUrl }),
      });
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      const calculatedBoxes = calculateFaceLocation(data);

      setBoxes(calculatedBoxes);

      // Update entries count
      const entriesResponse = await fetch(`${API_URL}/image`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auth0_id: user?.sub }),
      });

      if (!entriesResponse.ok) throw new Error("Failed to update entries");

      const entriesData = await entriesResponse.json();

      if (entriesData.entries !== undefined) {
        setEntries(entriesData.entries);
      } else {
        console.warn("Entries field missing in response:", entriesData);
      }
    } catch (error) {
      console.error("Error detecting faces:", error);
    }
  };

  const onButtonSubmit = async () => {
    if (!imageUrl) {
      console.warn("No image URL provided!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/imageurl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: imageUrl }),
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      const calculatedBoxes = calculateFaceLocation(data);
      setBoxes(calculatedBoxes);
    } catch (error) {
      console.error("Error in face detection:", error);
    }
  };

  const toggleModal = () => {
    setIsProfileOpen((prev) => !prev);
  };

  if (isLoading) {
    return (
      <LoadingScreen loading={true} bgColor="transparent" text="Loading..." />
    );
  }

  return (
    <AuthProvider>
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
              logoSrc=""
              text="Loading..."
              className="text-xl w-fit mx-auto backdrop-blur-sm"
            />
          }
        >
          <Navigation
            isAuthenticated={isAuthenticated}
            toggleModal={toggleModal}
          />
          {isProfileOpen && (
            <Modal>
              <Profile toggleModal={toggleModal} user={userData} />
            </Modal>
          )}
          {isAuthenticated ? (
            <>
              <Logo />
              <Rank name={user?.name} entries={entries} />
              <ImageLinkForm
                onInputChange={onInputChange}
                onImageSubmit={onImageSubmit}
                onButtonSubmit={onButtonSubmit}
              />
              <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
            </>
          ) : (
            <div className="center">
              <h2>Please log in to use the app</h2>
            </div>
          )}
        </Suspense>
      </div>
    </AuthProvider>
  );
}
