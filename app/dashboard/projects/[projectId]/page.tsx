"use client";

import { DataTable } from "@/components/data-table";
import {
    NonConformityRow,
    columns,
} from "@/components/projects/nonconformities/columns";
import NonConformityForm from "@/components/projects/nonconformities/form";
import SprintForm from "@/components/projects/sprint-form";
import { SiteHeader } from "@/components/site-header";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    deleteNonConformity,
    deleteSprint,
    getProjectDetail,
} from "@/lib/server/nonConformity";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type SprintRow = {
    id: string;
    name: string;
    startAt: Date;
    endAt: Date;
    nonConformities: NonConformityRow[];
};

type ProjectDetail = {
    id: string;
    name: string;
    usuarios: { id: string; name: string; email: string }[];
    sprints: SprintRow[];
};

export default function ProjectDetailPage() {
    const params = useParams<{ projectId: string }>();
    const projectId = params?.projectId;
    const [project, setProject] = useState<ProjectDetail | null>(null);
    const [selectedSprintId, setSelectedSprintId] = useState<string>("");
    const [openSprint, setOpenSprint] = useState(false);
    const [openEditSprint, setOpenEditSprint] = useState(false);
    const [openNC, setOpenNC] = useState(false);

    const load = async () => {
        if (!projectId) return;
        const p: any = await getProjectDetail(projectId);
        setProject(p);
        if (p?.sprints?.length && !selectedSprintId) {
            setSelectedSprintId(p.sprints[0].id);
        }
    };

    useEffect(() => {
        load();
    }, [projectId]);

    const selectedSprint = useMemo(() => {
        return project?.sprints?.find((s) => s.id === selectedSprintId);
    }, [project, selectedSprintId]);

    const deleteSelectedSprint = async () => {
        if (!selectedSprintId) return;
        await deleteSprint(selectedSprintId);
        setSelectedSprintId("");
        await load();
    };

    const deleteNC = async (id: string) => {
        await deleteNonConformity(id);
        await load();
    };

    return (
        <div>
            <SiteHeader name={project ? `Project: ${project.name}` : "Project"}>
                <Dialog open={openSprint} onOpenChange={setOpenSprint}>
                    <DialogTrigger asChild>
                        <Button size={"sm"} variant="outline">
                            Create Sprint
                        </Button>
                    </DialogTrigger>
                    <DialogContent
                        onInteractOutside={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <DialogHeader>Create sprint</DialogHeader>
                        <SprintForm
                            projectId={projectId ?? ""}
                            onSuccess={() => {
                                load();
                                setOpenSprint(false);
                            }}
                        />
                    </DialogContent>
                </Dialog>

                <Dialog open={openNC} onOpenChange={setOpenNC}>
                    <DialogTrigger asChild>
                        <Button size={"sm"}>Create NC</Button>
                    </DialogTrigger>
                    <DialogContent
                        onInteractOutside={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <DialogHeader>Create non conformity</DialogHeader>
                        {selectedSprintId ? (
                            <NonConformityForm
                                sprintId={selectedSprintId}
                                onSuccess={() => {
                                    load();
                                    setOpenNC(false);
                                }}
                            />
                        ) : (
                            <div className="text-sm text-muted-foreground">
                                Create/select a sprint first
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </SiteHeader>

            <div className="p-3 grid gap-3">
                <div className="flex items-center gap-2">
                    <div className="max-w-sm w-full">
                        <Select
                            value={selectedSprintId}
                            onValueChange={setSelectedSprintId}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select sprint" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {(project?.sprints ?? []).map((s) => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        {selectedSprint && (
                            <>
                                <div className="mt-2">
                                    {selectedSprint?.endAt.getDate() -
                                        new Date().getDate()}{" "}
                                    Days left
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-sm text-muted-foreground">
                                        From:{" "}
                                        {selectedSprint?.startAt.toDateString()}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        To:{" "}
                                        {selectedSprint?.endAt.toDateString()}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <Dialog
                        open={openEditSprint}
                        onOpenChange={setOpenEditSprint}
                    >
                        <DialogTrigger asChild>
                            <Button
                                size={"sm"}
                                variant="outline"
                                disabled={!selectedSprint}
                            >
                                Edit sprint
                            </Button>
                        </DialogTrigger>
                        <DialogContent
                            onInteractOutside={(e) => {
                                e.preventDefault();
                            }}
                        >
                            <DialogHeader>Update sprint</DialogHeader>
                            {selectedSprint && (
                                <SprintForm
                                    projectId={projectId ?? ""}
                                    initialData={{
                                        id: selectedSprint.id,
                                        name: selectedSprint.name,
                                        startAt: selectedSprint.startAt
                                            .toISOString()
                                            .slice(0, 10),
                                        endAt: selectedSprint.endAt
                                            .toISOString()
                                            .slice(0, 10),
                                    }}
                                    onSuccess={() => {
                                        load();
                                        setOpenEditSprint(false);
                                    }}
                                />
                            )}
                        </DialogContent>
                    </Dialog>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                size={"sm"}
                                variant="destructive"
                                disabled={!selectedSprint}
                            >
                                Delete sprint
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                Delete this sprint
                            </AlertDialogHeader>
                            Are you sure? This action can't be undone
                            <AlertDialogFooter>
                                <AlertDialogAction
                                    onClick={deleteSelectedSprint}
                                    variant={"destructive"}
                                >
                                    Delete
                                </AlertDialogAction>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                <DataTable
                    columns={columns({
                        sprintId: selectedSprintId,
                        reload: load,
                        deleteElement: deleteNC,
                    })}
                    data={selectedSprint?.nonConformities ?? []}
                />
            </div>
        </div>
    );
}
