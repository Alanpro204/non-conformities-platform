"use client";

import { createSprint, updateSprint } from "@/lib/server/nonConformity";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

const formSchema = z.object({
    name: z.string().min(1),
    startAt: z.string().min(1),
    endAt: z.string().min(1),
});

type Schema = z.infer<typeof formSchema>;

function SprintForm({
    projectId,
    initialData,
    onSuccess,
}: {
    projectId: string;
    initialData?: (Schema & { id: string }) | undefined;
    onSuccess?: () => void;
}) {
    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = useForm<Schema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name ?? "",
            startAt: initialData?.startAt ?? "",
            endAt: initialData?.endAt ?? "",
        },
    });

    const saveData = async (data: Schema) => {
        if (initialData)
            await updateSprint({
                id: initialData.id,
                name: data.name,
                startAt: new Date(data.startAt),
                endAt: new Date(data.endAt),
            });
        else
            await createSprint({
                projectId,
                name: data.name,
                startAt: new Date(data.startAt),
                endAt: new Date(data.endAt),
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
                            <FieldLabel htmlFor="sprint-name">Name</FieldLabel>
                            <Input
                                {...field}
                                id="sprint-name"
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
                    name="startAt"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="sprint-start">
                                Start
                            </FieldLabel>
                            <Input
                                {...field}
                                id="sprint-start"
                                type="date"
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
                    name="endAt"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="sprint-end">End</FieldLabel>
                            <Input
                                {...field}
                                id="sprint-end"
                                type="date"
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Button loading={isSubmitting} disabled={isSubmitting}>
                    Save sprint
                </Button>
            </FieldGroup>
        </form>
    );
}

export default SprintForm;
