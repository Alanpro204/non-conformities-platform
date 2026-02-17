"use server";

import { prisma } from "../prisma";

export const addMediaToNonConformity = async (data: {
    nonConformityId: string;
    mediaId: string;
}) => {
    return await prisma.nonConformity.update({
        where: { id: data.nonConformityId },
        data: {
            media: {
                connect: {
                    id: data.mediaId,
                },
            },
        },
    });
};

export const removeMediaFromNonConformity = async (data: {
    nonConformityId: string;
    mediaId: string;
}) => {
    return await prisma.nonConformity.update({
        where: { id: data.nonConformityId },
        data: {
            media: {
                disconnect: {
                    id: data.mediaId,
                },
            },
        },
    });
};
