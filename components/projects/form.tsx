"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createProject, updateProject } from "@/lib/server/project";
import { getAllUsers } from "@/lib/server/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    userIds: z.array(z.string()),
});

type Schema = z.infer<typeof formSchema>;

type UserLite = { id: string; name: string; email: string };

function ProjectForm({
    initialData,
    onSuccess,
}: {
    initialData?: (Schema & { id: string }) | undefined;
    onSuccess?: () => void;
}) {
    const [users, setUsers] = useState<UserLite[]>([]);

    const {
        handleSubmit,
        control,
        watch,
        formState: { isSubmitting },
        setValue,
    } = useForm<Schema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name ?? "",
            description: initialData?.description ?? "",
            userIds: initialData?.userIds ?? [],
        },
    });

    const selectedUserIds = watch("userIds") ?? [];

    useEffect(() => {
        (async () => {
            const all = await getAllUsers();
            setUsers(
                all.map((u: any) => ({
                    id: u.id,
                    name: u.name,
                    email: u.email,
                })),
            );
        })();
    }, []);

    const toggleUser = (id: string) => {
        const current = new Set(selectedUserIds);
        if (current.has(id)) current.delete(id);
        else current.add(id);
        setValue("userIds", Array.from(current));
    };

    const saveData = async (data: Schema) => {
        if (initialData)
            await updateProject({
                id: initialData.id,
                name: data.name,
                description: data.description,
                userIds: data.userIds,
            });
        else
            await createProject({
                name: data.name,
                description: data.description,
                userIds: data.userIds,
            });

        onSuccess?.();
    };

    return (
        <form onSubmit={handleSubmit(saveData)}>
            <FieldGroup>
                <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-rhf-demo-title">
                                Name
                            </FieldLabel>
                            <Input
                                {...field}
                                id="form-rhf-demo-title"
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-rhf-demo-description">
                                Description
                            </FieldLabel>
                            <Textarea
                                {...field}
                                id="form-rhf-demo-description"
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Field>
                    <FieldLabel>Project members</FieldLabel>
                    <div className="grid gap-2 max-h-56 overflow-auto rounded-md border p-2">
                        {users.map((u) => (
                            <label
                                key={u.id}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <Checkbox
                                    checked={selectedUserIds.includes(u.id)}
                                    onCheckedChange={() => toggleUser(u.id)}
                                />
                                <span className="text-sm">{u.name}</span>
                                <span className="text-xs text-muted-foreground">
                                    {u.email}
                                </span>
                            </label>
                        ))}
                        {users.length === 0 && (
                            <div className="text-sm text-muted-foreground">
                                No users available
                            </div>
                        )}
                    </div>
                </Field>

                <Button loading={isSubmitting} disabled={isSubmitting}>
                    Save project
                </Button>
            </FieldGroup>
        </form>
    );
}

export default ProjectForm;
