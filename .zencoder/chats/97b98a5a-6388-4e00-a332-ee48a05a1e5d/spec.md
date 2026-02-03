# Technical Specification: Admin Login and Signup

## Technical Context
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs.
- **Frontend**: React, Vite, React Router, Context API for Auth.

## Implementation Approach

### Backend Changes
1.  **Environment Variable**: Add `ADMIN_SIGNUP_SECRET` to `backend/.env`. This will be required to register as an admin.
2.  **`authController.js`**:
    *   **Signup**: Modify the `signup` function to check for an `adminSecret` in the request body. If it matches `ADMIN_SIGNUP_SECRET`, set `role: 'admin'` and `isAdmin: true` for the new user.
    *   **Login**: Update the `login` function to first check the database for the user. If found, use their stored role. The hardcoded admin should be kept as a fallback for initial setup or emergency access.
3.  **Routes**: Use existing `/api/auth/signup` and `/api/auth/login` routes, but they will now handle both users and admins dynamically.

### Frontend Changes
1.  **Components**:
    *   **`AdminSignupModal.jsx`**: A new modal specifically for admin signup, including a field for the "Admin Secret Key".
    *   **`AdminLoginModal.jsx`**: (Optional) Can reuse `LoginModal` since it already handles redirection based on role, but a dedicated one might be clearer.
2.  **`Navbar.jsx`**:
    *   Add a way to access Admin Login/Signup (e.g., in the footer or a hidden/specific section).
3.  **`AuthContext.jsx`**:
    *   Ensure the `signup` function can pass the `adminSecret` to the backend.

## Source Code Structure Changes
- `frontend/src/components/AdminSignupModal.jsx` (New)
- `frontend/src/components/AdminLoginModal.jsx` (New)

## Data Model / API Changes
- No changes to `User` model (already has `role` and `isAdmin`).
- `POST /api/auth/signup` will now accept an optional `adminSecret` field.

## Verification Approach
1.  **Manual Testing**:
    *   Attempt to sign up as a regular user (should work as before).
    *   Attempt to sign up as an admin with a wrong secret key (should fail or create a regular user - better to fail if `isAdmin` was requested).
    *   Attempt to sign up as an admin with the correct secret key.
    *   Log in with the new admin account and verify access to `/admin/dashboard`.
2.  **Automated Testing**: (If applicable) Run existing lint/test commands.
