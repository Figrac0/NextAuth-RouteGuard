// components/starting-page/starting-page.js
import Link from "next/link";
import classes from "./starting-page.module.css";

function StartingPageContent() {
    return (
        <section className={classes.starting}>
            <div className={classes.hero}>
                <h1>AuraConnect</h1>
                <p className={classes.subtitle}>
                    Elevate your conversations with premium chat experience.
                    Secure, elegant, and designed for meaningful connections.
                </p>

                <div className={classes.features}>
                    <div className={classes.featureCard}>
                        <div className={classes.featureIcon}>🔒</div>
                        <h3>Military-Grade Security</h3>
                        <p>
                            End-to-end encryption ensures your conversations
                            remain private and secure
                        </p>
                    </div>

                    <div className={classes.featureCard}>
                        <div className={classes.featureIcon}>💎</div>
                        <h3>Premium Experience</h3>
                        <p>
                            Enjoy elegant design with smooth animations and
                            intuitive interface
                        </p>
                    </div>

                    <div className={classes.featureCard}>
                        <div className={classes.featureIcon}>⚡</div>
                        <h3>Lightning Fast</h3>
                        <p>
                            Real-time messaging with instant delivery and no
                            latency
                        </p>
                    </div>

                    <div className={classes.featureCard}>
                        <div className={classes.featureIcon}>🌐</div>
                        <h3>Global Reach</h3>
                        <p>
                            Connect with friends and colleagues anywhere in the
                            world
                        </p>
                    </div>

                    <div className={classes.featureCard}>
                        <div className={classes.featureIcon}>🎨</div>
                        <h3>Custom Themes</h3>
                        <p>
                            Personalize your chat environment with beautiful
                            color schemes
                        </p>
                    </div>

                    <div className={classes.featureCard}>
                        <div className={classes.featureIcon}>📱</div>
                        <h3>Cross-Platform</h3>
                        <p>
                            Seamless experience across web, mobile, and desktop
                            devices
                        </p>
                    </div>
                </div>
            </div>

            <div className={classes.cta}>
                <h2>Ready to Transform Your Communication?</h2>
                <p>
                    Join thousands of users who already trust AuraConnect for
                    their daily conversations. Experience the difference today.
                </p>
                <Link href="/auth" legacyBehavior>
                    <a className={classes.ctaButton}>Get Started Now</a>
                </Link>
            </div>
        </section>
    );
}

export default StartingPageContent;
