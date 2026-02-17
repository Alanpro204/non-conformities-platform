"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, ArrowUpDown, Edit, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "../ui/dialog";
import ProjectForm from "./form";

type ProjectRow = {
    id: string;
    name: string;
    description?: string | null;
    createdAt: Date;
    usuarios: { id: string; name: string; email: string }[];
};

export const columns = (fns: {
    reload: () => void;
    deleteElement: (id: string) => void;
}): ColumnDef<ProjectRow>[] => [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            return (
                <Link
                    className="flex gap-2 items-center w-fit"
                    href={`/dashboard/projects/${row.original.id}`}
                >
                    {row.original.name}
                    <ArrowRight size={20} />
                </Link>
            );
        },
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            return (
                <div className="max-w-[400px] truncate">
                    {row.original.description ?? ""}
                </div>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <span
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Created At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </span>
            );
        },
        cell: ({ row }) => {
            return <div>{row.original.createdAt.toDateString()}</div>;
        },
    },
    {
        id: "members",
        header: "Members",
        cell: ({ row }) => {
            return <div>{row.original.usuarios.length}</div>;
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const project = row.original;

            return (
                <div className="space-x-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                className="cursor-pointer"
                                size="sm"
                                variant="default"
                            >
                                <Edit />
                            </Button>
                        </DialogTrigger>
                        <DialogContent
                            onInteractOutside={(e) => {
                                e.preventDefault();
                            }}
                        >
                            <DialogHeader>Update project</DialogHeader>
                            <ProjectForm
                                initialData={{
                                    id: project.id,
                                    name: project.name,
                                    description: project.description ?? "",
                                    userIds: project.usuarios.map((u) => u.id),
                                }}
                                onSuccess={fns.reload}
                            />
                        </DialogContent>
                    </Dialog>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                className="cursor-pointer"
                                size={"sm"}
                                variant="destructive"
                            >
                                <Trash />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                Delete this project
                            </AlertDialogHeader>
                            Are you sure? This action can't be undone
                            <AlertDialogFooter>
                                <AlertDialogAction
                                    onClick={() =>
                                        fns.deleteElement(project.id)
                                    }
                                    variant={"destructive"}
                                >
                                    Delete
                                </AlertDialogAction>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            );
        },
    },
];
