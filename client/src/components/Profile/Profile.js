import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { API_URL } from "../../config";

import "./Profile.styles.css";

export default function Profile({ toggleModal, user, setUser }) {
  const { getAccessTokenSilently, user: auth0User } = useAuth0();
  const [profileImage, setProfileImage] = useState(
    user.profile_image || auth0User.picture || ""
  );
  const [name, setName] = useState(user.name || "");
  const [age, setAge] = useState(user.age || "");
  const [pet, setPet] = useState(user.pet || "");
  const [loading, setLoading] = useState(false);

  const CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.REACT_APP_UPLOAD_PRESET;

  // Sends updated profile data to the backend
  const saveProfile = async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();

      const payload = {};
      if (name) payload.name = name;
      if (age !== "") payload.age = age;
      if (pet) payload.pet = pet;
      if (profileImage) payload.profile_image = profileImage;

      const url = `${API_URL}/profile/${user.id}`;
      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      });

      setUser(response.data);
      toggleModal();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  // Uploads selected image to Cloudinary and saves the URL
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      setLoading(true);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setProfileImage(data.secure_url);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-modal">
      <article className="br3 ba b--black-40 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-navy">
        <main className="pa4 w-80 white">
          <img
            src={profileImage || auth0User?.picture}
            className="mr3 br-100 h3 w3 dib"
            alt="avatar"
          />
          <label className="mt2 fw6" htmlFor="profile-image">
            Profile Image URL:
          </label>
          <input
            className="pa2 ba w-100"
            placeholder="Enter image URL"
            type="file"
            name="profile-image"
            id="profile-image"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <h1>{name || "Your Name"}</h1>
          <h4>{`Images Submitted: ${user?.entries || 0}`}</h4>
          <p>{`Member Since: ${
            user?.joined ? new Date(user.joined).toLocaleDateString() : "N/A"
          }`}</p>
          <hr />
          <label className="mt2 fw6" htmlFor="user-name">
            Name:
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            className="pa2 ba w-100"
            placeholder={user.name || "Enter name"}
            type="text"
            name="user-name"
            id="name"
            value={name}
          />
          <label className="mt2 fw6" htmlFor="user-age">
            Age:
          </label>
          <input
            onChange={(e) => setAge(e.target.value)}
            className="pa2 ba w-100"
            placeholder={user.age || "Enter age"}
            type="text"
            name="user-age"
            id="age"
            value={age}
          />
          <label className="mt2 fw6" htmlFor="user-pet">
            Pet:
          </label>
          <input
            onChange={(e) => setPet(e.target.value)}
            className="pa2 ba w-100"
            placeholder={user.pet || "Enter pet"}
            type="text"
            name="user-pet"
            id="pet"
            value={pet}
          />
          <div
            className="mt4"
            style={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <button
              onClick={saveProfile}
              className="b pa2 grow pointer hover-white w-40 bg-green b--black-20"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              className="b pa2 grow pointer hover-white w-40 bg-red b--black-20"
              onClick={toggleModal}
            >
              Cancel
            </button>
          </div>
        </main>
        <div className="modal-close" onClick={toggleModal}>
          &times;
        </div>
      </article>
    </div>
  );
}
