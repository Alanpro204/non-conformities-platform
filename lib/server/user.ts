"use server";

import { Role, User } from "@/prisma/generated/client";
import { auth } from "../auth";
import { prisma } from "../prisma";

export const updateUser = async (data: Partial<User>) => {
    return await prisma.user.update({
        data: {
            email: data.email,
            name: data.name,
            type: data.type as Role,
        },
        where: {
            id: data.id,
        },
    });
};

export const getAllUsers = async () => {
    return await prisma.user.findMany();
};

export const createUser = async (data: {
    name: string;
    email: string;
    password: string;
    type: Role;
}) => {
    return await auth.api.signUpEmail({
        body: {
            email: data.email,
            name: data.name,
            type: data.type,
            password: data.password,
        },
    });
};

export const deleteUser = async (id: string) => {
    return await prisma.user.delete({
        where: {
            id: id,
        },
    });
};
