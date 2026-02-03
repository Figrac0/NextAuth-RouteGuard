import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import ProfileForm from "./profile-form";
import classes from "./user-profile.module.css";

function UserProfile() {
    const { data: session, status } = useSession();
    const loading = status === "loading";

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordChangeStatus, setPasswordChangeStatus] = useState({
        type: "",
        message: "",
    });

    const [userData, setUserData] = useState({
        email: "user@example.com",
        memberSince: "Jan 15, 2024",
        status: "Active",
        lastLogin: "Today, 14:30",
        messages: 128,
        friends: 24,
        onlineHours: 156,
        streakDays: 7,
        groups: 5,
    });

    const [recentActivity, setRecentActivity] = useState([
        { id: 1, icon: "💬", text: "Sent message to Alex", time: "2 min ago" },
        {
            id: 2,
            icon: "👥",
            text: "Joined 'Design Team' group",
            time: "1 hour ago",
        },
        {
            id: 3,
            icon: "📱",
            text: "Logged in from new device",
            time: "3 hours ago",
        },
        {
            id: 4,
            icon: "⭐",
            text: "Received 5-star rating",
            time: "Yesterday",
        },
        {
            id: 5,
            icon: "🔔",
            text: "Updated notification settings",
            time: "2 days ago",
        },
    ]);

    const [securityLog, setSecurityLog] = useState([
        {
            id: 1,
            action: "Password changed",
            time: "Just now",
            device: "Chrome, Windows",
        },
        {
            id: 2,
            action: "New login",
            time: "Today, 14:30",
            device: "Firefox, MacOS",
        },
        {
            id: 3,
            action: "Two-factor enabled",
            time: "2 days ago",
            device: "Safari, iOS",
        },
        {
            id: 4,
            action: "Email updated",
            time: "1 week ago",
            device: "Chrome, Android",
        },
    ]);

    useEffect(() => {
        if (session?.user?.email) {
            setUserData((prev) => ({
                ...prev,
                email: session.user.email,
                lastLogin: new Date().toLocaleString("en-US", {
                    weekday: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            }));
        }
    }, [session]);

    if (loading) {
        return (
            <section className={classes.profile}>
                <div className={classes.loading}>
                    <div className={classes.spinner}></div>
                    <p>Loading your profile...</p>
                    <small>Preparing your personalized experience</small>
                </div>
            </section>
        );
    }

    // Если нет сессии (пользователь не авторизован), покажем сообщение
    if (!session) {
        return (
            <section className={classes.profile}>
                <div className={classes.notAuthenticated}>
                    <h2>Not Authenticated</h2>
                    <p>Please log in to view your profile.</p>
                </div>
            </section>
        );
    }

    async function changePasswordHandler(passwordData) {
        setPasswordChangeStatus({ type: "", message: "" });

        // Валидация
        if (passwordData.oldPassword === passwordData.newPassword) {
            setPasswordChangeStatus({
                type: "error",
                message: "New password must be different from old password",
            });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordChangeStatus({
                type: "error",
                message: "Password must be at least 6 characters long",
            });
            return;
        }

        try {
            const response = await fetch("/api/user/change-password", {
                method: "PATCH",
                body: JSON.stringify(passwordData),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to change password");
            }

            setPasswordChangeStatus({
                type: "success",
                message:
                    "Password changed successfully! Updating security log...",
            });

            // Добавляем запись в лог безопасности
            setSecurityLog((prev) => [
                {
                    id: prev.length + 1,
                    action: "Password changed",
                    time: "Just now",
                    device: `${navigator.userAgent.split(" ")[0]}, ${navigator.platform}`,
                },
                ...prev,
            ]);

            // Очищаем форму через 3 секунды
            setTimeout(() => {
                setShowPasswordForm(false);
                setPasswordChangeStatus({ type: "", message: "" });
            }, 3000);
        } catch (error) {
            console.error("Password change error:", error);
            setPasswordChangeStatus({
                type: "error",
                message:
                    error.message ||
                    "Failed to change password. Please try again.",
            });
        }
    }

    const handleQuickAction = (action) => {
        // Показываем уведомление вместо alert
        setPasswordChangeStatus({
            type: "info",
            message: `${action} feature is coming soon!`,
        });

        setTimeout(() => {
            setPasswordChangeStatus({ type: "", message: "" });
        }, 3000);
    };

    const handleLogoutAllSessions = () => {
        if (
            window.confirm("Are you sure you want to logout from all devices?")
        ) {
            handleQuickAction("Logout from all devices");
        }
    };

    return (
        <section className={classes.profile}>
            {/* Уведомления */}
            {passwordChangeStatus.message && (
                <div
                    className={`${classes.notification} ${classes[passwordChangeStatus.type]}`}>
                    <span className={classes.notificationIcon}>
                        {passwordChangeStatus.type === "success"
                            ? "✅"
                            : passwordChangeStatus.type === "error"
                              ? "⚠️"
                              : "ℹ️"}
                    </span>
                    <p>{passwordChangeStatus.message}</p>
                    <button
                        className={classes.closeNotification}
                        onClick={() =>
                            setPasswordChangeStatus({ type: "", message: "" })
                        }>
                        ×
                    </button>
                </div>
            )}

            <div className={classes.profileContainer}>
                <div className={classes.userInfoCard}>
                    <div className={classes.cardHeader}>
                        <h2>Account Information</h2>
                        <button
                            className={classes.editButton}
                            onClick={() => handleQuickAction("Edit Profile")}>
                            ✏️ Edit
                        </button>
                    </div>
                    <div className={classes.userInfo}>
                        <div className={classes.infoItem}>
                            <div className={classes.infoLabel}>
                                <span className={classes.infoIcon}>📧</span>
                                <span>Email Address</span>
                            </div>
                            <div className={classes.infoValue}>
                                {userData.email}
                                <button
                                    className={classes.copyButton}
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            userData.email,
                                        );
                                        handleQuickAction(
                                            "Email copied to clipboard",
                                        );
                                    }}>
                                    📋
                                </button>
                            </div>
                        </div>
                        <div className={classes.infoItem}>
                            <div className={classes.infoLabel}>
                                <span className={classes.infoIcon}>📅</span>
                                <span>Member Since</span>
                            </div>
                            <div className={classes.infoValue}>
                                {userData.memberSince}
                                <span className={classes.daysActive}>
                                    (
                                    {Math.floor(
                                        (new Date() - new Date("2024-01-15")) /
                                            (1000 * 60 * 60 * 24),
                                    )}{" "}
                                    days)
                                </span>
                            </div>
                        </div>
                        <div className={classes.infoItem}>
                            <div className={classes.infoLabel}>
                                <span className={classes.infoIcon}>✅</span>
                                <span>Account Status</span>
                            </div>
                            <div className={classes.statusContainer}>
                                <div className={classes.statusBadge}>
                                    {userData.status}
                                </div>
                                <div className={classes.statusIndicator}></div>
                            </div>
                        </div>
                        <div className={classes.infoItem}>
                            <div className={classes.infoLabel}>
                                <span className={classes.infoIcon}>🕒</span>
                                <span>Last Login</span>
                            </div>
                            <div className={classes.infoValue}>
                                {userData.lastLogin}
                                <small className={classes.loginLocation}>
                                    (Location: San Francisco, CA)
                                </small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Карточка активности */}
                <div className={classes.activityCard}>
                    <h2>Activity Overview</h2>
                    <div className={classes.activityStats}>
                        <div className={classes.activityItem}>
                            <span className={classes.activityIcon}>💬</span>
                            <span className={classes.activityValue}>
                                {userData.messages}
                            </span>
                            <span className={classes.activityLabel}>
                                Messages
                            </span>
                            <div className={classes.activityProgress}>
                                <div
                                    className={classes.progressBar}
                                    style={{ width: "85%" }}></div>
                            </div>
                        </div>
                        <div className={classes.activityItem}>
                            <span className={classes.activityIcon}>👥</span>
                            <span className={classes.activityValue}>
                                {userData.friends}
                            </span>
                            <span className={classes.activityLabel}>
                                Friends
                            </span>
                            <div className={classes.activityProgress}>
                                <div
                                    className={classes.progressBar}
                                    style={{ width: "60%" }}></div>
                            </div>
                        </div>
                        <div className={classes.activityItem}>
                            <span className={classes.activityIcon}>🔥</span>
                            <span className={classes.activityValue}>
                                {userData.streakDays}d
                            </span>
                            <span className={classes.activityLabel}>
                                Streak
                            </span>
                            <div className={classes.activityProgress}>
                                <div
                                    className={classes.progressBar}
                                    style={{
                                        width: `${Math.min(100, userData.streakDays * 10)}%`,
                                    }}></div>
                            </div>
                        </div>
                        <div className={classes.activityItem}>
                            <span className={classes.activityIcon}>🏆</span>
                            <span className={classes.activityValue}>
                                {userData.groups}
                            </span>
                            <span className={classes.activityLabel}>
                                Groups
                            </span>
                            <div className={classes.activityProgress}>
                                <div
                                    className={classes.progressBar}
                                    style={{ width: "40%" }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={classes.featureSections}>
                <div
                    className={`${classes.featureSection} ${classes.quickActions}`}>
                    <div className={classes.sectionHeader}>
                        <h2>Quick Actions</h2>
                        <small>Click to perform actions</small>
                    </div>
                    <div className={classes.quickActionsGrid}>
                        <div
                            className={classes.quickAction}
                            onClick={() => handleQuickAction("Edit Profile")}>
                            <div className={classes.quickActionContent}>
                                <span className={classes.quickActionIcon}>
                                    ✏️
                                </span>
                                <span className={classes.quickActionLabel}>
                                    Edit Profile
                                </span>
                            </div>
                            <span className={classes.quickActionArrow}>→</span>
                        </div>
                        <div
                            className={classes.quickAction}
                            onClick={() =>
                                handleQuickAction("Privacy Settings")
                            }>
                            <div className={classes.quickActionContent}>
                                <span className={classes.quickActionIcon}>
                                    👁️
                                </span>
                                <span className={classes.quickActionLabel}>
                                    Privacy Settings
                                </span>
                            </div>
                            <span className={classes.quickActionArrow}>→</span>
                        </div>
                        <div
                            className={classes.quickAction}
                            onClick={() => handleQuickAction("Theme Settings")}>
                            <div className={classes.quickActionContent}>
                                <span className={classes.quickActionIcon}>
                                    🎨
                                </span>
                                <span className={classes.quickActionLabel}>
                                    Themes
                                </span>
                            </div>
                            <span className={classes.quickActionArrow}>→</span>
                        </div>
                        <div
                            className={classes.quickAction}
                            onClick={() =>
                                handleQuickAction("Notification Settings")
                            }>
                            <div className={classes.quickActionContent}>
                                <span className={classes.quickActionIcon}>
                                    🔔
                                </span>
                                <span className={classes.quickActionLabel}>
                                    Notifications
                                </span>
                            </div>
                            <span className={classes.quickActionArrow}>→</span>
                        </div>
                    </div>
                </div>

                <div
                    className={`${classes.featureSection} ${classes.recentActivity}`}>
                    <div className={classes.sectionHeader}>
                        <h2>Recent Activity</h2>
                        <small>Your latest actions</small>
                    </div>
                    <div className={classes.activityList}>
                        {recentActivity.map((activity) => (
                            <div
                                key={activity.id}
                                className={classes.activityListItem}>
                                <span className={classes.activityIconSmall}>
                                    {activity.icon}
                                </span>
                                <div className={classes.activityContent}>
                                    <span className={classes.activityText}>
                                        {activity.text}
                                    </span>
                                    <span className={classes.activityTime}>
                                        {activity.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    className={`${classes.featureSection} ${classes.securityLog}`}>
                    <div className={classes.sectionHeader}>
                        <h2>Security Log</h2>
                        <small>Recent security events</small>
                    </div>
                    <div className={classes.securityLogList}>
                        {securityLog.map((log) => (
                            <div
                                key={log.id}
                                className={classes.securityLogItem}>
                                <div className={classes.securityLogIcon}>
                                    🔒
                                </div>
                                <div className={classes.securityLogContent}>
                                    <div className={classes.securityLogAction}>
                                        {log.action}
                                    </div>
                                    <div className={classes.securityLogDetails}>
                                        <span
                                            className={classes.securityLogTime}>
                                            {log.time}
                                        </span>
                                        <span
                                            className={
                                                classes.securityLogDevice
                                            }>
                                            {log.device}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        className={classes.viewAllButton}
                        onClick={handleLogoutAllSessions}>
                        Logout All Sessions
                    </button>
                </div>
            </div>

            {!showPasswordForm && (
                <div className={classes.passwordSection}>
                    <div className={classes.sectionHeader}>
                        <h2>Password Management</h2>
                        <small>Last changed: 2 weeks ago</small>
                    </div>
                    <button
                        className={classes.changePasswordButton}
                        onClick={() => setShowPasswordForm(true)}>
                        <span className={classes.buttonIcon}>🔑</span>
                        Change Password
                    </button>
                </div>
            )}

            {showPasswordForm && (
                <div className={classes.passwordFormContainer}>
                    <div className={classes.formHeader}>
                        <h2>Change Your Password</h2>
                        <button
                            className={classes.closeFormButton}
                            onClick={() => {
                                setShowPasswordForm(false);
                                setPasswordChangeStatus({
                                    type: "",
                                    message: "",
                                });
                            }}>
                            ✕
                        </button>
                    </div>
                    <ProfileForm
                        onChangePassword={changePasswordHandler}
                        isLoading={passwordChangeStatus.type === "loading"}
                    />
                    <div className={classes.passwordTips}>
                        <h4>Password Tips:</h4>
                        <ul>
                            <li>Use at least 8 characters</li>
                            <li>Mix letters, numbers, and symbols</li>
                            <li>Avoid common words and patterns</li>
                            <li>Don't reuse old passwords</li>
                        </ul>
                    </div>
                </div>
            )}
        </section>
    );
}

export default UserProfile;
