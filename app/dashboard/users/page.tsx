"use client";
import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { columns } from "@/components/users/columns";
import UserForm from "@/components/users/form";
import { deleteUser, getAllUsers } from "@/lib/server/user";
import { User } from "better-auth";
import { useEffect, useState } from "react";

type UserWithType = User & { type: string };

export default function UsersPage() {
    const [users, setUsers] = useState<UserWithType[]>([]);
    const [open, setOpen] = useState(false);

    const loadUsers = async () => {
        setUsers(await getAllUsers());
    };

    const deleteElement = async (id: string) => {
        deleteUser(id);
        loadUsers();
    };

    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <div>
            <SiteHeader name="Users">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button size={"sm"}>Create User</Button>
                    </DialogTrigger>
                    <DialogContent
                        onInteractOutside={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <DialogHeader>Create user</DialogHeader>
                        <UserForm
                            onSuccess={() => {
                                loadUsers();
                                setOpen(false);
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </SiteHeader>
            <div className="p-3">
                <DataTable
                    columns={columns({
                        reload: loadUsers,
                        deleteElement: deleteElement,
                    })}
                    data={users}
                />
            </div>
        </div>
    );
}
