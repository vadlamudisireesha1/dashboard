// src/components/login/AuthDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import usersData from "../../data/users.json";

/**
 * Props:
 *  - open (bool)
 *  - onClose (fn)
 *  - onLoginSuccess(user)  -> called with the user object after successful login
 */
export default function AuthDialog({ open, onClose, onLoginSuccess }) {
  const [tab, setTab] = useState(0); // 0 login, 1 signup

  // Login inputs
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");

  // Signup inputs (now only email + password)
  const [signupUser, setSignupUser] = useState("");
  const [signupPass, setSignupPass] = useState("");

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [localUsers, setLocalUsers] = useState([]);

  useEffect(() => {
    // load any users from localStorage (signup adds them)
    const stored = localStorage.getItem("custom_users");
    setLocalUsers(stored ? JSON.parse(stored) : []);
  }, [open]);

  function resetFeedback() {
    setError("");
    setInfo("");
  }

  function handleTabChange(_, v) {
    setTab(v);
    resetFeedback();
  }

  function findUser(usernameTrimmed, passwordTrimmed) {
    // check bundled users.json first
    const fromBundle = usersData.find(
      (u) => u.username.trim().toLowerCase() === usernameTrimmed.toLowerCase() && u.password === passwordTrimmed
    );
    if (fromBundle) return fromBundle;

    // check in local users
    const fromLocal = localUsers.find(
      (u) => u.username.trim().toLowerCase() === usernameTrimmed.toLowerCase() && u.password === passwordTrimmed
    );
    if (fromLocal) return fromLocal;

    return null;
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    resetFeedback();

    const usernameTrimmed = loginUser.trim();
    const passwordTrimmed = loginPass; // keep password as-is (no trim to preserve intended spaces)

    if (!usernameTrimmed || !passwordTrimmed) {
      setError("Please enter both email and password.");
      return;
    }

    const user = findUser(usernameTrimmed, passwordTrimmed);
    if (user) {
      // success
      onLoginSuccess(user);
      return;
    }

    setError("Invalid credentials. Try a demo user or sign up.");
  }

  function handleSignupSubmit(e) {
    e.preventDefault();
    resetFeedback();

    const usernameTrimmed = signupUser.trim();
    const passwordTrimmed = signupPass;

    if (!usernameTrimmed || !passwordTrimmed) {
      setError("Provide email and password.");
      return;
    }

    // simple uniqueness check across both sets
    const existsInBundle = usersData.some((u) => u.username.trim().toLowerCase() === usernameTrimmed.toLowerCase());
    const existsInLocal = localUsers.some((u) => u.username.trim().toLowerCase() === usernameTrimmed.toLowerCase());
    if (existsInBundle || existsInLocal) {
      setError("User already exists. Try logging in.");
      return;
    }

    // create user object and store in localStorage (brandText defaults to 'The Picks')
    const newUser = {
      id: Date.now(),
      username: usernameTrimmed,
      password: passwordTrimmed,
      brandText: "The Picks",
    };
    const updated = [...localUsers, newUser];
    localStorage.setItem("custom_users", JSON.stringify(updated));
    setLocalUsers(updated);
    setInfo("Account created locally. You are now logged in.");

    // auto-login using the new user
    onLoginSuccess(newUser);
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography sx={{ fontWeight: 700 }}>Profile / Sign in</Typography>
      </DialogTitle>

      <DialogContent>
        <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Login" />
          <Tab label="Sign up" />
        </Tabs>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {info && <Alert severity="success" sx={{ mb: 2 }}>{info}</Alert>}

        {tab === 0 ? (
          <Box component="form" onSubmit={handleLoginSubmit} sx={{ display: "grid", gap: 2 }}>
            <TextField
              label="Email"
              value={loginUser}
              onChange={(e) => setLoginUser(e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="Password"
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              type="password"
              size="small"
              fullWidth
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
              <Button variant="outlined" onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained">Login</Button>
            </Box>

            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Demo accounts (from users.json):
              </Typography>
              <Box sx={{ mt: 1 }}>
                {usersData.map((u) => (
                  <Typography key={u.id} variant="body2" sx={{ whiteSpace: "nowrap" }}>
                    {u.id} — {u.username} / {u.password} → brand: {u.brandText}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSignupSubmit} sx={{ display: "grid", gap: 2 }}>
            <TextField
              label="Email"
              value={signupUser}
              onChange={(e) => setSignupUser(e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="Password"
              value={signupPass}
              onChange={(e) => setSignupPass(e.target.value)}
              type="password"
              size="small"
              fullWidth
            />

            {/* Removed Brand Text input per your request */}

            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
              <Button variant="outlined" onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained">Create account</Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
