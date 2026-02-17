"use client";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "better-auth";
import { ArrowUpDown, Edit, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import UserForm from "./form";

export const columns = (fns: {
    reload: () => void;
    deleteElement: (id: string) => void;
}): ColumnDef<User & { type: string }>[] => [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
            return (
                <a href={`mailto:${row.original.email}`}>
                    {row.original.email}
                </a>
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
        accessorKey: "type",
        header: "Type",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const user = row.original;

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
                            <DialogHeader>Update user</DialogHeader>
                            <UserForm
                                initialData={{
                                    id: user.id,
                                    email: user.email,
                                    name: user.name,
                                    type: user.type,
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
                                Delete this user
                            </AlertDialogHeader>
                            Are you sure? This action can't be undone
                            <AlertDialogFooter>
                                <AlertDialogAction
                                    onClick={() =>
                                        fns.deleteElement(row.original.id)
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
