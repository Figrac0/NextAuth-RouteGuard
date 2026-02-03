import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

export function useAuth(redirectTo = "/auth") {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function checkAuth() {
            const sessionData = await getSession();

            if (!sessionData && redirectTo) {
                router.replace(redirectTo);
            } else {
                setSession(sessionData);
                setLoading(false);
            }
        }

        checkAuth();
    }, [router, redirectTo]);

    return { session, loading };
}
