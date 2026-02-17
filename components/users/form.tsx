"use client";
import { createUser, updateUser } from "@/lib/server/user";
import { Role } from "@/prisma/generated/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

const formSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z
        .string()
        .min(6, { error: "La contraseña debe tener al menos 6 caracteres" })
        .optional(),
    type: z.string(),
});

type Schema = z.infer<typeof formSchema>;

function UserForm({
    initialData,
    onSuccess,
}: {
    initialData?: Schema & { id: string };
    onSuccess?: () => void;
}) {
    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = useForm<Schema>({
        resolver: zodResolver(formSchema),
        values: initialData,
    });
    const saveData = async (data: Schema) => {
        if (initialData)
            await updateUser({
                id: initialData?.id,
                name: data.name,
                email: data.email,
                type: data.type as Role,
            });
        else
            await createUser({
                name: data.name,
                email: data.email,
                password: data.password!,
                type: data.type as Role,
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
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-rhf-demo-title">
                                Email
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
                {!initialData && (
                    <Controller
                        name="password"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="form-rhf-demo-title">
                                    Password
                                </FieldLabel>
                                <Input
                                    {...field}
                                    required
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
                )}
                <Controller
                    name="type"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-rhf-demo-title">
                                Type of user
                            </FieldLabel>
                            <Select
                                value={field.value}
                                defaultValue={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="ADMIN">
                                            ADMIN
                                        </SelectItem>
                                        <SelectItem value="TESTER">
                                            TESTER
                                        </SelectItem>
                                        <SelectItem value="DEVELOPER">
                                            DEVELOPER
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Button loading={isSubmitting} disabled={isSubmitting}>
                    Save user
                </Button>
            </FieldGroup>
        </form>
    );
}

export default UserForm;
