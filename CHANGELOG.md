# Changelog

All notable changes to the **SmartBrain** project will be documented in this file.

---

## [2025-04-25]

### Added

- Integrated **Auth0** for secure user authentication.
- Created logic to **store Auth0 users** in the PostgreSQL database using `auth0_id`.
- Added **Profile Modal** with editable fields:
  - Name, age, pet, and profile picture.
- Enabled users to **upload profile images** through Cloudinary.
- Improved welcome experience with persistent login handling.

---

## [Initial Release]

### Features

- Face detection using the Clarifai API.
- Supports **multi-face detection**.
- Frontend built with **React** and styled with **Tachyons**.
- Backend developed using **Node.js** and **Express**.
- User data stored with **PostgreSQL**.
- Tracks number of images processed per user.
- Deployed using:
  - **Render** for frontend/backend
  - **Neon** for database

---

> Visit the [Live Site](https://smartbrain-mtf1.onrender.com) for a live demo!
