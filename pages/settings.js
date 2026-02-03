import { useState } from "react";
import { getSession } from "next-auth/react";
import Layout from "../components/layout/layout";
import classes from "../components/settings/settings.module.css";

function SettingsPage() {
    const [theme, setTheme] = useState("dark");
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sound: false,
        marketing: false,
    });
    const [privacy, setPrivacy] = useState({
        profileVisible: true,
        onlineStatus: true,
        activityVisible: true,
    });
    const [language, setLanguage] = useState("en");
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState("");

    const themes = [
        {
            id: "dark",
            name: "Dark Elegance",
            color: "#1a0a1f",
            textColor: "#ffffff",
        },
        {
            id: "light",
            name: "Light Premium",
            color: "#f5f5f5",
            textColor: "#1a0a1f",
        },
        {
            id: "midnight",
            name: "Midnight Blue",
            color: "#0a1f2a",
            textColor: "#ffffff",
        },
        {
            id: "amethyst",
            name: "Amethyst",
            color: "#2d0e2f",
            textColor: "#ffffff",
        },
    ];

    const languages = [
        { code: "en", name: "English" },
        { code: "es", name: "Spanish" },
        { code: "fr", name: "French" },
        { code: "de", name: "German" },
    ];

    const handleNotificationToggle = (type) => {
        setNotifications((prev) => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    const handlePrivacyToggle = (type) => {
        setPrivacy((prev) => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    const handleSaveSettings = async () => {
        setIsSaving(true);

        setTimeout(() => {
            setIsSaving(false);
            setSaveStatus("Settings saved successfully!");

            setTimeout(() => {
                setSaveStatus("");
            }, 3000);
        }, 1500);
    };

    // Функция для определения контрастного цвета текста
    const getTextColor = (backgroundColor) => {
        // Преобразуем hex в RGB
        const hex = backgroundColor.replace("#", "");
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        // Рассчитываем яркость (формула восприятия яркости)
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        // Возвращаем черный для светлых фонов, белый для темных
        return brightness > 128 ? "#1a0a1f" : "#ffffff";
    };

    return (
        <div className={classes.settings}>
            <h1>Settings</h1>

            {saveStatus && (
                <div className={classes.saveStatus}>
                    <span className={classes.statusIcon}>✅</span>
                    {saveStatus}
                </div>
            )}

            <div className={classes.settingsSections}>
                <div className={classes.settingsSection}>
                    <h2>
                        <span className={classes.sectionIcon}>🎨</span>
                        Theme Preferences
                    </h2>
                    <div className={classes.themeSelector}>
                        {themes.map((themeOption) => (
                            <div
                                key={themeOption.id}
                                className={`${classes.themeOption} ${theme === themeOption.id ? classes.selected : ""}`}
                                onClick={() => setTheme(themeOption.id)}
                                style={{
                                    backgroundColor: themeOption.color,
                                    color: themeOption.textColor,
                                }}>
                                <div className={classes.themePreview}></div>
                                <span
                                    className={classes.themeName}
                                    style={{ color: themeOption.textColor }}>
                                    {themeOption.name}
                                </span>
                                {theme === themeOption.id && (
                                    <span
                                        className={classes.selectedBadge}
                                        style={{
                                            backgroundColor:
                                                themeOption.textColor,
                                            color: themeOption.color,
                                        }}>
                                        ✓
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={classes.settingsSection}>
                    <h2>
                        <span className={classes.sectionIcon}>🔔</span>
                        Notifications
                    </h2>
                    <div className={classes.toggleGroup}>
                        {Object.entries(notifications).map(([key, value]) => (
                            <div key={key} className={classes.toggleItem}>
                                <span className={classes.toggleLabel}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                                    Notifications
                                </span>
                                <button
                                    className={`${classes.toggleButton} ${value ? classes.active : ""}`}
                                    onClick={() =>
                                        handleNotificationToggle(key)
                                    }>
                                    <div className={classes.toggleSlider}></div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Конфиденциальность */}
                <div className={classes.settingsSection}>
                    <h2>
                        <span className={classes.sectionIcon}>👁️</span>
                        Privacy Settings
                    </h2>
                    <div className={classes.toggleGroup}>
                        {Object.entries(privacy).map(([key, value]) => (
                            <div key={key} className={classes.toggleItem}>
                                <span className={classes.toggleLabel}>
                                    {key === "profileVisible" &&
                                        "Show Profile to Others"}
                                    {key === "onlineStatus" &&
                                        "Show Online Status"}
                                    {key === "activityVisible" &&
                                        "Show Recent Activity"}
                                </span>
                                <button
                                    className={`${classes.toggleButton} ${value ? classes.active : ""}`}
                                    onClick={() => handlePrivacyToggle(key)}>
                                    <div className={classes.toggleSlider}></div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Язык */}
                <div className={classes.settingsSection}>
                    <h2>
                        <span className={classes.sectionIcon}>🌐</span>
                        Language & Region
                    </h2>
                    <div className={classes.languageSelector}>
                        {languages.map((lang) => (
                            <div
                                key={lang.code}
                                className={`${classes.languageOption} ${language === lang.code ? classes.selected : ""}`}
                                onClick={() => setLanguage(lang.code)}>
                                <span className={classes.languageName}>
                                    {lang.name}
                                </span>
                                {language === lang.code && (
                                    <span className={classes.selectedBadge}>
                                        ✓
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={classes.actions}>
                <button
                    className={classes.saveButton}
                    onClick={handleSaveSettings}
                    disabled={isSaving}>
                    {isSaving ? (
                        <>
                            <span className={classes.loadingSpinner}></span>
                            Saving...
                        </>
                    ) : (
                        "Save All Settings"
                    )}
                </button>
                <button
                    className={classes.resetButton}
                    onClick={() => {
                        setTheme("dark");
                        setNotifications({
                            email: true,
                            push: true,
                            sound: false,
                            marketing: false,
                        });
                        setPrivacy({
                            profileVisible: true,
                            onlineStatus: true,
                            activityVisible: true,
                        });
                        setLanguage("en");
                    }}>
                    Reset to Defaults
                </button>
            </div>
        </div>
    );
}

SettingsPage.getLayout = (page) => <Layout>{page}</Layout>;

export async function getServerSideProps(context) {
    const session = await getSession({ req: context.req });

    if (!session) {
        return {
            redirect: {
                destination: "/auth",
                permanent: false,
            },
        };
    }

    return {
        props: { session },
    };
}

export default SettingsPage;
