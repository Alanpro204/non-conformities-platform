"use server";

import { randomUUID } from "crypto";

import {
    NonConformityPriority,
    NonConformityStatus,
} from "@/prisma/generated/enums";
import { prisma } from "../prisma";
import { getSignedUser } from "./login";

export const getProjectDetail = async (projectId: string) => {
    return await prisma.proyecto.findUnique({
        where: { id: projectId },
        include: {
            usuarios: true,
            sprints: {
                orderBy: { startAt: "desc" },
                include: {
                    nonConformities: {
                        orderBy: { createdAt: "desc" },
                        include: {
                            type: true,
                            createdBy: true,
                            assignedTo: true,
                            media: true,
                        },
                    },
                },
            },
        },
    });
};

export const createSprint = async (data: {
    projectId: string;
    name: string;
    startAt: Date;
    endAt: Date;
}) => {
    return await prisma.sprint.create({
        data: {
            id: randomUUID(),
            project: {
                connect: {
                    id: data.projectId,
                },
            },
            name: data.name,
            startAt: data.startAt,
            endAt: data.endAt,
        },
    });
};

export const deleteSprint = async (id: string) => {
    return await prisma.sprint.delete({
        where: { id },
    });
};

export const updateSprint = async (data: {
    id: string;
    name: string;
    startAt: Date;
    endAt: Date;
}) => {
    return await prisma.sprint.update({
        where: { id: data.id },
        data: {
            name: data.name,
            startAt: data.startAt,
            endAt: data.endAt,
        },
    });
};

export const createNonConformity = async (data: {
    title: string;
    description: string;
    expected: string;
    sprintId: string;
    typeId: string;
    priority: NonConformityPriority;
    assignedToId: string;
}) => {
    const user = await getSignedUser();
    if (!user) {
        throw new Error("Not authenticated");
    }

    return await prisma.nonConformity.create({
        data: {
            id: randomUUID(),
            title: data.title,
            description: data.description,
            expected: data.expected,
            sprint: {
                connect: {
                    id: data.sprintId,
                },
            },
            type: {
                connect: {
                    id: data.typeId,
                },
            },
            status: NonConformityStatus.NEW,
            priority: data.priority,
            createdBy: {
                connect: {
                    id: user.id,
                },
            },
            assignedTo: {
                connect: {
                    id: data.assignedToId,
                },
            },
        },
    });
};

export const updateNonConformity = async (data: {
    id: string;
    title: string;
    description: string;
    expected: string;
    typeId: string;
    status: NonConformityStatus;
    priority: NonConformityPriority;
    assignedToId: string;
}) => {
    return await prisma.nonConformity.update({
        where: { id: data.id },
        data: {
            title: data.title,
            description: data.description,
            expected: data.expected,
            type: {
                connect: {
                    id: data.typeId,
                },
            },
            status: data.status,
            priority: data.priority,
            assignedTo: {
                connect: {
                    id: data.assignedToId,
                },
            },
        },
    });
};

export const deleteNonConformity = async (id: string) => {
    return await prisma.nonConformity.delete({
        where: { id },
    });
};
