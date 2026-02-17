"use client";

import {
    createNonConformityType,
    updateNonConformityType,
} from "@/lib/server/nonConformityType";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

const formSchema = z.object({
    name: z.string().min(1),
});

type Schema = z.infer<typeof formSchema>;

function CategoryForm({
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
        if (initialData) {
            try {
                await updateNonConformityType({
                    id: initialData.id,
                    name: data.name,
                });
                toast.success("Category updated successfully");
            } catch (error) {
                toast.error(error as string);
            }
        } else {
            try {
                await createNonConformityType({ name: data.name });
                toast.success("Category created successfully");
            } catch (error) {
                toast.error(error as string);
            }
        }

        onSuccess?.();
    };

    return (
        <form
            onSubmit={(e) => {
                e.stopPropagation();
                handleSubmit(saveData)(e);
            }}
        >
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
                <Button loading={isSubmitting} disabled={isSubmitting}>
                    Save category
                </Button>
            </FieldGroup>
        </form>
    );
}

export default CategoryForm;
