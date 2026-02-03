import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

import classes from "./main-navigation.module.css";

function MainNavigation() {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [showMenu, setShowMenu] = useState(false);

    function logoutHandler() {
        signOut();
    }

    function toggleMenu() {
        setShowMenu(!showMenu);
    }

    return (
        <header className={classes.header}>
            <div className={classes.headerContent}>
                <Link href="/" legacyBehavior>
                    <a className={classes.logoLink}>
                        <div className={classes.logo}>
                            <span className={classes.logoIcon}>✨</span>
                            AuraConnect
                        </div>
                    </a>
                </Link>

                <button
                    className={classes.menuToggle}
                    onClick={toggleMenu}
                    aria-label="Toggle menu">
                    <span
                        className={`${classes.menuIcon} ${showMenu ? classes.active : ""}`}></span>
                </button>

                <nav
                    className={`${classes.nav} ${showMenu ? classes.show : ""}`}>
                    <ul>
                        <li>
                            <Link href="/" legacyBehavior>
                                <a onClick={() => setShowMenu(false)}>Home</a>
                            </Link>
                        </li>

                        {!session && !loading && (
                            <li>
                                <Link href="/auth" legacyBehavior>
                                    <a onClick={() => setShowMenu(false)}>
                                        Login
                                    </a>
                                </Link>
                            </li>
                        )}

                        {session && (
                            <>
                                <li>
                                    <Link href="/profile" legacyBehavior>
                                        <a onClick={() => setShowMenu(false)}>
                                            Profile
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/settings" legacyBehavior>
                                        <a onClick={() => setShowMenu(false)}>
                                            Settings
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <div className={classes.userMenu}>
                                        <span className={classes.userName}>
                                            👤{" "}
                                            {session.user?.email?.split(
                                                "@",
                                            )[0] || "User"}
                                        </span>
                                        <button
                                            onClick={logoutHandler}
                                            className={classes.logoutButton}>
                                            Logout
                                        </button>
                                    </div>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default MainNavigation;
