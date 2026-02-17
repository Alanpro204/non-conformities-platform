"use server";

import { randomUUID } from "crypto";

import { prisma } from "../prisma";

export const getAllNonConformityTypes = async () => {
  return await prisma.nonConformityType.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      nonConformities: true,
    },
  });
};

export const createNonConformityType = async (data: { name: string }) => {
  return await prisma.nonConformityType.create({
    data: {
      id: randomUUID(),
      name: data.name,
    },
  });
};

export const updateNonConformityType = async (data: {
  id: string;
  name: string;
}) => {
  return await prisma.nonConformityType.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
    },
  });
};

export const deleteNonConformityType = async (id: string) => {
  return await prisma.nonConformityType.delete({
    where: {
      id,
    },
  });
};
