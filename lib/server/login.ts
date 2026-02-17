"use server";

import { headers } from "next/headers";
import { auth } from "../auth";

export const authLogin = async (email: string, password: string) => {
    return auth.api.signInEmail({
        body: {
            email: email,
            password: password,
        },
    });
};
export const getSignedUser = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    return session?.user;
};
