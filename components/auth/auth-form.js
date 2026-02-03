import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

import classes from "./auth-form.module.css";

async function createUser(email, password) {
    const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong!");
    }

    return data;
}

function AuthForm() {
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const [confirmPasswordRef] = useState(useRef());

    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    function switchAuthModeHandler() {
        setIsLogin((prevState) => !prevState);
        setError("");
        setSuccess("");
    }

    async function submitHandler(event) {
        event.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;
        const enteredConfirmPassword = !isLogin
            ? confirmPasswordRef.current?.value
            : "";

        // Валидация
        if (!enteredEmail || !enteredEmail.includes("@")) {
            setError("Please enter a valid email address.");
            setIsLoading(false);
            return;
        }

        if (!isLogin && enteredPassword !== enteredConfirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        if (enteredPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            setIsLoading(false);
            return;
        }

        try {
            if (isLogin) {
                const result = await signIn("credentials", {
                    redirect: false,
                    email: enteredEmail,
                    password: enteredPassword,
                });

                if (result.error) {
                    setError("Invalid credentials. Please try again.");
                } else {
                    setSuccess("Login successful! Redirecting...");
                    setTimeout(() => {
                        router.replace("/profile");
                    }, 1500);
                }
            } else {
                const result = await createUser(enteredEmail, enteredPassword);
                setSuccess("Account created successfully! You can now login.");

                // Переключаемся на форму входа
                setTimeout(() => {
                    setIsLogin(true);
                    emailInputRef.current.value = enteredEmail;
                    passwordInputRef.current.value = "";
                    if (confirmPasswordRef.current)
                        confirmPasswordRef.current.value = "";
                }, 2000);
            }
        } catch (error) {
            setError(error.message || "Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section className={classes.auth}>
            <h1>{isLogin ? "Welcome Back!" : "Create Account"}</h1>
            <p className={classes.subtitle}>
                {isLogin
                    ? "Sign in to your account"
                    : "Join our community today"}
            </p>

            {/* Уведомления */}
            {error && (
                <div className={classes.errorAlert}>
                    <span className={classes.alertIcon}>⚠️</span>
                    <p>{error}</p>
                    <button
                        className={classes.closeAlert}
                        onClick={() => setError("")}>
                        ×
                    </button>
                </div>
            )}

            {success && (
                <div className={classes.successAlert}>
                    <span className={classes.alertIcon}>✅</span>
                    <p>{success}</p>
                    <button
                        className={classes.closeAlert}
                        onClick={() => setSuccess("")}>
                        ×
                    </button>
                </div>
            )}

            <form onSubmit={submitHandler}>
                <div className={classes.control}>
                    <label htmlFor="email">
                        <span className={classes.labelIcon}>📧</span>
                        Your Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        required
                        ref={emailInputRef}
                        placeholder="Enter your email"
                        disabled={isLoading}
                    />
                </div>

                <div className={classes.control}>
                    <label htmlFor="password">
                        <span className={classes.labelIcon}>🔒</span>
                        Your Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        required
                        ref={passwordInputRef}
                        placeholder="Enter your password"
                        disabled={isLoading}
                    />
                </div>

                {!isLogin && (
                    <div className={classes.control}>
                        <label htmlFor="confirmPassword">
                            <span className={classes.labelIcon}>🔑</span>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            required
                            ref={confirmPasswordRef}
                            placeholder="Confirm your password"
                            disabled={isLoading}
                        />
                    </div>
                )}

                {isLogin && (
                    <div className={classes.forgotPassword}>
                        <button type="button" className={classes.forgotLink}>
                            Forgot password?
                        </button>
                    </div>
                )}

                <div className={classes.actions}>
                    <button disabled={isLoading}>
                        {isLoading ? (
                            <div className={classes.loadingSpinner}></div>
                        ) : isLogin ? (
                            "Sign In"
                        ) : (
                            "Create Account"
                        )}
                    </button>

                    <div className={classes.divider}>
                        <span>or</span>
                    </div>

                    <button
                        type="button"
                        className={classes.toggle}
                        onClick={switchAuthModeHandler}
                        disabled={isLoading}>
                        {isLogin
                            ? "Create new account"
                            : "Login with existing account"}
                    </button>

                    {isLogin && (
                        <button
                            type="button"
                            className={classes.socialButton}
                            disabled={isLoading}>
                            <span className={classes.socialIcon}>👤</span>
                            Sign in as Guest (Demo)
                        </button>
                    )}
                </div>
            </form>

            <div className={classes.features}>
                <h3>Why join us?</h3>
                <div className={classes.featureList}>
                    <div className={classes.featureItem}>
                        <span className={classes.featureIcon}>🔒</span>
                        <span>Secure Authentication</span>
                    </div>
                    <div className={classes.featureItem}>
                        <span className={classes.featureIcon}>⚡</span>
                        <span>Fast & Reliable</span>
                    </div>
                    <div className={classes.featureItem}>
                        <span className={classes.featureIcon}>🎨</span>
                        <span>Beautiful Interface</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AuthForm;
