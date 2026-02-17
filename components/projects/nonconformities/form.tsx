"use client";

import CategoryForm from "@/components/categories/form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
    addMediaToNonConformity,
    removeMediaFromNonConformity,
} from "@/lib/server/media";
import {
    createNonConformity,
    updateNonConformity,
} from "@/lib/server/nonConformity";
import { getAllNonConformityTypes } from "@/lib/server/nonConformityType";
import { getAllUsers } from "@/lib/server/user";
import {
    NonConformityPriority,
    NonConformityStatus,
} from "@/prisma/generated/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../../ui/field";
import { Input } from "../../ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../ui/select";

const formSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    expected: z.string().min(1),
    typeId: z.string().min(1),
    priority: z.string().min(1),
    assignedToId: z.string().min(1),
    status: z.string().optional(),
});

type Schema = z.infer<typeof formSchema>;

type UserLite = { id: string; name: string; email: string };

type TypeLite = { id: string; name: string };

type MediaLite = { id: string; fileId: string };

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|bmp|svg)$/i;
const isImageFile = (file: File) => file.type.startsWith("image/");
const isImageFileId = (fileId: string) => IMAGE_EXT.test(fileId);

function NonConformityForm({
    sprintId,
    initialData,
    onSuccess,
}: {
    sprintId: string;
    initialData?: (Schema & { id: string; media?: MediaLite[] }) | undefined;
    onSuccess?: () => void;
}) {
    const [users, setUsers] = useState<UserLite[]>([]);
    const [types, setTypes] = useState<TypeLite[]>([]);
    const [uploading, setUploading] = useState(false);
    const [openTypeForm, setOpenTypeForm] = useState(false);
    const [pendingAttachments, setPendingAttachments] = useState<
        { file: File; objectUrl: string | null }[]
    >([]);
    const [failedPreviewIds, setFailedPreviewIds] = useState<Set<string>>(
        () => new Set(),
    );
    const pendingAttachmentsRef = useRef(pendingAttachments);
    pendingAttachmentsRef.current = pendingAttachments;

    const statusOptions = useMemo(() => Object.keys(NonConformityStatus), []);
    const priorityOptions = useMemo(
        () => Object.keys(NonConformityPriority),
        [],
    );

    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = useForm<Schema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title ?? "",
            description: initialData?.description ?? "",
            expected: initialData?.expected ?? "",
            typeId: initialData?.typeId ?? "",
            priority: initialData?.priority ?? "MEDIUM",
            assignedToId: initialData?.assignedToId ?? "",
            status: initialData?.status ?? "NEW",
        },
    });

    const loadData = () => {
        (async () => {
            const [allUsers, allTypes] = await Promise.all([
                getAllUsers(),
                getAllNonConformityTypes(),
            ]);
            setUsers(
                allUsers.map((u: any) => ({
                    id: u.id,
                    name: u.name,
                    email: u.email,
                })),
            );
            setTypes(allTypes);
        })();
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        return () => {
            pendingAttachmentsRef.current.forEach((a) => {
                if (a.objectUrl) URL.revokeObjectURL(a.objectUrl);
            });
        };
    }, []);

    const saveData = async (data: Schema) => {
        if (initialData) {
            await updateNonConformity({
                id: initialData.id,
                title: data.title,
                description: data.description,
                expected: data.expected,
                typeId: data.typeId,
                status: data.status as NonConformityStatus,
                priority: data.priority as NonConformityPriority,
                assignedToId: data.assignedToId,
            });
        } else {
            const created = await createNonConformity({
                sprintId,
                title: data.title,
                description: data.description,
                expected: data.expected,
                typeId: data.typeId,
                priority: data.priority as NonConformityPriority,
                assignedToId: data.assignedToId,
            });
            for (const { file, objectUrl } of pendingAttachments) {
                const form = new FormData();
                form.append("file", file);
                const res = await fetch("/api/media", {
                    method: "POST",
                    body: form,
                });
                if (!res.ok) continue;
                const json = (await res.json()) as { id: string };
                await addMediaToNonConformity({
                    nonConformityId: created.id,
                    mediaId: json.id,
                });
                if (objectUrl) URL.revokeObjectURL(objectUrl);
            }
            setPendingAttachments([]);
        }

        onSuccess?.();
    };

    const uploadMedia = async (file: File) => {
        if (!initialData?.id) return;

        setUploading(true);
        try {
            const form = new FormData();
            form.append("file", file);
            const res = await fetch("/api/media", {
                method: "POST",
                body: form,
            });
            if (!res.ok) {
                throw new Error("Upload failed");
            }
            const json = (await res.json()) as { id: string };

            await addMediaToNonConformity({
                nonConformityId: initialData.id,
                mediaId: json.id,
            });

            onSuccess?.();
        } finally {
            setUploading(false);
        }
    };

    const removeMedia = async (mediaId: string) => {
        if (!initialData?.id) return;

        await removeMediaFromNonConformity({
            nonConformityId: initialData.id,
            mediaId,
        });
        await fetch(`/api/media/${mediaId}`, { method: "DELETE" });
        onSuccess?.();
    };

    return (
        <form onSubmit={handleSubmit(saveData)}>
            <FieldGroup>
                <Controller
                    name="title"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="nc-title">
                                Bug title
                            </FieldLabel>
                            <Input
                                {...field}
                                id="nc-title"
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
                            <FieldLabel htmlFor="nc-description">
                                Bug description
                            </FieldLabel>
                            <Textarea
                                {...field}
                                id="nc-description"
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
                    name="expected"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="nc-expected">
                                Expected behavior
                            </FieldLabel>
                            <Textarea
                                {...field}
                                id="nc-expected"
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
                    name="typeId"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Type</FieldLabel>
                            <div className="flex gap-2">
                                <Select
                                    value={field.value}
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {types.map((t) => (
                                                <SelectItem
                                                    key={t.id}
                                                    value={t.id}
                                                >
                                                    {t.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {/* Create Type */}
                                <Dialog
                                    open={openTypeForm}
                                    onOpenChange={setOpenTypeForm}
                                >
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>Create type</DialogHeader>
                                        <CategoryForm
                                            onSuccess={() => {
                                                loadData();
                                                setOpenTypeForm(false);
                                            }}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </div>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="priority"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Priority</FieldLabel>
                            <Select
                                value={field.value}
                                defaultValue={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {priorityOptions.map((p) => (
                                            <SelectItem key={p} value={p}>
                                                {p}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                {initialData && (
                    <Controller
                        name="status"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Status</FieldLabel>
                                <Select
                                    value={field.value}
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {statusOptions.map((s) => (
                                                <SelectItem key={s} value={s}>
                                                    {s}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                )}

                <Controller
                    name="assignedToId"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Assigned to</FieldLabel>
                            <Select
                                value={field.value}
                                defaultValue={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a user" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {users.map((u) => (
                                            <SelectItem key={u.id} value={u.id}>
                                                {u.name} ({u.email})
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Field>
                    <FieldLabel>Attachments</FieldLabel>
                    <div className="grid min-w-0 max-w-full grid-cols-1 gap-2">
                        <div className="min-w-0 max-w-full">
                            <Input
                                type="file"
                                disabled={uploading}
                                className="w-full min-w-0 max-w-full"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    if (initialData) {
                                        uploadMedia(file);
                                    } else {
                                        const objectUrl = isImageFile(file)
                                            ? URL.createObjectURL(file)
                                            : null;
                                        setPendingAttachments((prev) => [
                                            ...prev,
                                            { file, objectUrl },
                                        ]);
                                    }
                                    e.target.value = "";
                                }}
                            />
                        </div>
                        <div className="grid min-w-0 max-w-full grid-cols-1 gap-1">
                            {initialData
                                ? (initialData.media ?? []).map((m) => (
                                      <div
                                          key={m.id}
                                          className="flex min-w-0 items-center justify-between gap-2 overflow-hidden rounded-md border px-2 py-1"
                                      >
                                          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
                                              {isImageFileId(m.fileId) &&
                                                  !failedPreviewIds.has(
                                                      m.id,
                                                  ) && (
                                                      <a
                                                          href={`/api/media/${m.id}`}
                                                          target="_blank"
                                                          rel="noreferrer"
                                                          className="h-12 w-12 shrink-0 overflow-hidden rounded"
                                                      >
                                                          <img
                                                              src={`/api/media/${m.id}`}
                                                              alt=""
                                                              className="h-12 w-12 rounded object-cover"
                                                              onError={() => {
                                                                  setFailedPreviewIds(
                                                                      (
                                                                          prev,
                                                                      ) => {
                                                                          const next =
                                                                              new Set(
                                                                                  prev,
                                                                              );
                                                                          next.add(
                                                                              m.id,
                                                                          );
                                                                          return next;
                                                                      },
                                                                  );
                                                              }}
                                                          />
                                                      </a>
                                                  )}
                                              <a
                                                  className="min-w-0 truncate text-sm"
                                                  href={`/api/media/${m.id}`}
                                                  target="_blank"
                                                  rel="noreferrer"
                                                  title={m.fileId}
                                              >
                                                  {m.fileId}
                                              </a>
                                          </div>
                                          <Button
                                              type="button"
                                              size="sm"
                                              variant="destructive"
                                              className="shrink-0"
                                              onClick={() => removeMedia(m.id)}
                                          >
                                              Remove
                                          </Button>
                                      </div>
                                  ))
                                : pendingAttachments.map((item, i) => (
                                      <div
                                          key={`${item.file.name}-${i}`}
                                          className="flex min-w-0 items-center justify-between gap-2 overflow-hidden rounded-md border px-2 py-1"
                                      >
                                          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
                                              {item.objectUrl && (
                                                  <img
                                                      src={item.objectUrl}
                                                      alt=""
                                                      className="h-12 w-12 shrink-0 rounded object-cover"
                                                  />
                                              )}
                                              <span
                                                  className="min-w-0 truncate text-sm"
                                                  title={item.file.name}
                                              >
                                                  {item.file.name}
                                              </span>
                                          </div>
                                          <Button
                                              type="button"
                                              size="sm"
                                              variant="destructive"
                                              className="shrink-0"
                                              onClick={() => {
                                                  if (item.objectUrl)
                                                      URL.revokeObjectURL(
                                                          item.objectUrl,
                                                      );
                                                  setPendingAttachments(
                                                      (prev) =>
                                                          prev.filter(
                                                              (_, idx) =>
                                                                  idx !== i,
                                                          ),
                                                  );
                                              }}
                                          >
                                              Remove
                                          </Button>
                                      </div>
                                  ))}
                            {((initialData &&
                                (initialData.media ?? []).length === 0) ||
                                (!initialData &&
                                    pendingAttachments.length === 0)) && (
                                <div className="text-sm text-muted-foreground">
                                    No attachments
                                </div>
                            )}
                        </div>
                    </div>
                </Field>

                <Button loading={isSubmitting} disabled={isSubmitting}>
                    Save non conformity
                </Button>
            </FieldGroup>
        </form>
    );
}

export default NonConformityForm;
