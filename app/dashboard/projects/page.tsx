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
import { columns } from "@/components/projects/columns";
import ProjectForm from "@/components/projects/form";
import { deleteProject, getAllProjects } from "@/lib/server/project";
import { useEffect, useState } from "react";

type ProjectRow = {
    id: string;
    name: string;
    description?: string | null;
    createdAt: Date;
    usuarios: { id: string; name: string; email: string }[];
};

export default function ProjectsPage() {
    const [projects, setProjects] = useState<ProjectRow[]>([]);
    const [open, setOpen] = useState(false);

    const loadProjects = async () => {
        setProjects(await getAllProjects());
    };

    const deleteElement = async (id: string) => {
        await deleteProject(id);
        await loadProjects();
    };

    useEffect(() => {
        loadProjects();
    }, []);

    return (
        <div>
            <SiteHeader name="Projects">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button size={"sm"}>Create Project</Button>
                    </DialogTrigger>
                    <DialogContent
                        onInteractOutside={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <DialogHeader>Create project</DialogHeader>
                        <ProjectForm
                            onSuccess={() => {
                                loadProjects();
                                setOpen(false);
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </SiteHeader>
            <div className="p-3">
                <DataTable
                    columns={columns({
                        reload: loadProjects,
                        deleteElement: deleteElement,
                    })}
                    data={projects}
                />
            </div>
        </div>
    );
}
