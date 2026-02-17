"use client";

import { DataTable } from "@/components/data-table";
import { columns } from "@/components/categories/columns";
import CategoryForm from "@/components/categories/form";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  deleteNonConformityType,
  getAllNonConformityTypes,
} from "@/lib/server/nonConformityType";
import { NonConformity } from "@/prisma/generated/client";
import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  nonConformities: NonConformity[];
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);

  const loadCategories = async () => {
    setCategories(await getAllNonConformityTypes());
  };

  const deleteElement = async (id: string) => {
    await deleteNonConformityType(id);
    await loadCategories();
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div>
      <SiteHeader name="Categories">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size={"sm"}>Create Category</Button>
          </DialogTrigger>
          <DialogContent
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
          >
            <DialogHeader>Create category</DialogHeader>
            <CategoryForm
              onSuccess={() => {
                loadCategories();
                setOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </SiteHeader>
      <div className="p-3">
        <DataTable
          columns={columns({
            reload: loadCategories,
            deleteElement: deleteElement,
          })}
          data={categories}
        />
      </div>
    </div>
  );
}
