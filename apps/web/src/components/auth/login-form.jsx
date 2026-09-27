"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { getErrorMessage } from "@/lib/error-message";
import { generatePassword } from "@/lib/generate-password";
import { getSafeReturnPath } from "@/lib/safe-return-path";
import shared from "@/styles/shared.module.css";
import styles from "./login.module.css";

export function LoginForm({ mode = "login", nextPath = "/products" }) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const passwordBytes = new TextEncoder().encode(password).length;
  const minimumLength = 15;
  const isWeakPassword =
    password.length < minimumLength ||
    passwordBytes > 72 ||
    /^(.)\1+$/.test(password);
  const passwordsDoNotMatch =
    mode === "register" &&
    confirmPassword.length > 0 &&
    confirmPassword !== password;
  const safePath = getSafeReturnPath(nextPath);
  const alternatePath = mode === "login" ? "/signup" : "/login";
  const alternateHref =
    safePath === "/products"
      ? alternatePath
      : `${alternatePath}?next=${encodeURIComponent(safePath)}`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (mode === "register" && confirmPassword !== password) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setPending(true);
    try {
      if (mode === "register") await register({ name, email, password });
      else await login({ email, password, rememberMe });
      router.replace(safePath);
      router.refresh();
    } catch (authError) {
      setError(
        getErrorMessage(authError, "Unable to continue. Please try again."),
      );
      setPending(false);
    }
  };

  const handleGeneratePassword = () => {
    try {
      setPassword(generatePassword());
      setConfirmPassword("");
      setShowPassword(true);
      setError("");
    } catch {
      setError("Could not generate a password. Please enter one manually.");
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.heading}>
        <span className={styles.icon}>
          <LockKeyhole size={19} />
        </span>
        <span className={shared.eyebrow}>
          {mode === "login" ? "Member access" : "Create an account"}
        </span>
        <h1>{mode === "login" ? "Back for more?" : "Join the crew."}</h1>
        <p>
          {mode === "login"
            ? "Sign in, grab your stash, and keep rolling."
            : "Create your account to save drops, shop, and place orders."}
        </p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        {mode === "register" && (
          <div className={styles.field}>
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              minLength={2}
              maxLength={100}
              required
            />
          </div>
        )}
        <div className={styles.field}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            maxLength={254}
            required
          />
        </div>
        <div className={styles.field}>
          <div className={styles.fieldLabelRow}>
            <label htmlFor="password">Password</label>
            <span>{minimumLength}+ characters</span>
          </div>
          <div className={styles.passwordField}>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              minLength={15}
              maxLength={200}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {mode === "register" && (
            <button
              className={styles.generatePassword}
              type="button"
              onClick={handleGeneratePassword}
            >
              Generate password
            </button>
          )}
          {passwordBytes > 72 && (
            <p role="alert">Password must be at most 72 UTF-8 bytes.</p>
          )}
        </div>
        {mode === "register" && (
          <div className={styles.field}>
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              aria-invalid={passwordsDoNotMatch}
              aria-describedby={
                passwordsDoNotMatch ? "password-mismatch" : undefined
              }
              required
            />
            {passwordsDoNotMatch && (
              <p
                id="password-mismatch"
                className={`${shared.error} ${styles.fieldError}`}
                role="alert"
              >
                Passwords do not match.
              </p>
            )}
          </div>
        )}
        {mode === "login" && (
          <label className={styles.rememberMe}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            <span>Remember me for 7 days</span>
          </label>
        )}
        {error && (
          <p className={`${shared.error} ${styles.error}`} role="alert">
            {error}
          </p>
        )}
        <button
          className={`${shared.button} ${shared.buttonBlue} ${styles.submit}`}
          type="submit"
          disabled={
            pending ||
            !email ||
            !password ||
            isWeakPassword ||
            (mode === "register" &&
              (name.trim().length < 2 || confirmPassword !== password))
          }
        >
          {pending ? (
            <>
              <span className={shared.spinner} />
              Please wait
            </>
          ) : (
            <>
              {mode === "login" ? "Sign in" : "Create account"}{" "}
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </form>
      <div className={styles.switcher}>
        <span>
          {mode === "login" ? "New around here?" : "Already in the crew?"}
        </span>
        <Link href={alternateHref}>
          {mode === "login" ? "Create an account" : "Sign in instead"}
        </Link>
      </div>
      <p className={styles.disclaimer}>
        Your account and session are securely managed by the server.
      </p>
    </div>
  );
}
