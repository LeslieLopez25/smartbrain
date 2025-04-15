import React, { useState, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { API_URL } from "../../config";

import "./Profile.css";

export default function Profile({ toggleModal, user = {} }) {
  const { getAccessTokenSilently } = useAuth0();

  const [name, setName] = useState(user?.name || "");
  const [age, setAge] = useState(user?.age || "");
  const [pet, setPet] = useState(user?.pet || "");
  const [loading, setLoading] = useState(false);

  const saveProfile = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const response = await axios.post(
        `${API_URL}/profile`,
        { name, age, pet },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Profile updated successfully:", response.data);
        toggleModal();
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  }, [name, age, pet, getAccessTokenSilently, toggleModal]);

  return (
    <div className="profile-modal">
      <article className="br3 ba b--black-40 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-navy">
        <main className="pa4 w-80 white">
          <img
            src="http://tachyons.io/img/logo.jpg"
            className="h3 w3 dib"
            alt="avatar"
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
            className="pa2 ba w-100"
            placeholder={user.name}
            type="text"
            name="user-name"
            id="name"
          />
          <label className="mt2 fw6" htmlFor="user-age">
            Age:
          </label>
          <input
            className="pa2 ba w-100"
            placeholder={user.age}
            type="number"
            name="user-age"
            id="age"
          />
          <label className="mt2 fw6" htmlFor="user-pet">
            Pet:
          </label>
          <input
            className="pa2 ba w-100"
            placeholder={user.pet}
            type="text"
            name="user-pet"
            id="pet"
          />
          <div
            className="mt4"
            style={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <button
              className="b pa2 grow pointer hover-white w-40 bg-green b--black-20"
              onClick={saveProfile}
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
};

export default Profile;
