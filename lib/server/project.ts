"use server";

import { randomUUID } from "crypto";

import { prisma } from "../prisma";

export type ProjectUpsertInput = {
    id?: string;
    name: string;
    description?: string | null;
    userIds: string[];
};

export const getAllProjects = async () => {
    return await prisma.proyecto.findMany({
        include: {
            usuarios: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const createProject = async (data: ProjectUpsertInput) => {
    return await prisma.proyecto.create({
        data: {
            id: randomUUID(),
            name: data.name,
            description: data.description ?? null,
            usuarios: {
                connect: data.userIds.map((id) => ({ id })),
            },
        },
    });
};

export const updateProject = async (data: ProjectUpsertInput & { id: string }) => {
    return await prisma.proyecto.update({
        where: {
            id: data.id,
        },
        data: {
            name: data.name,
            description: data.description ?? null,
            usuarios: {
                set: data.userIds.map((id) => ({ id })),
            },
        },
        include: {
            usuarios: true,
        },
    });
};

export const deleteProject = async (id: string) => {
    return await prisma.proyecto.delete({
        where: {
            id,
        },
    });
};
