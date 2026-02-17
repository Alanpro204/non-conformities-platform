"use client";

import { ColumnDef } from "@tanstack/react-table";
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
import CategoryForm from "./form";
import { deleteNonConformityType } from "@/lib/server/nonConformityType";
import { toast } from "sonner";
import { NonConformity } from "@/prisma/generated/client";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const columns = (fns: {
  reload: () => void;
  deleteElement: (id: string) => void;
}): ColumnDef<{
  id: string;
  name: string;
  nonConformities: NonConformity[];
}>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </span>
      );
    },
  },
  {
    accessorKey: "nonConformities",
    header: "Non conformities",
    cell: ({ row }) => {
      return <span>{row.original.nonConformities.length}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const category = row.original;

      return (
        <div className="space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="cursor-pointer" size="icon" variant="default">
                <Edit />
              </Button>
            </DialogTrigger>
            <DialogContent
              onInteractOutside={(e) => {
                e.preventDefault();
              }}
            >
              <DialogHeader>Update category</DialogHeader>
              <CategoryForm
                initialData={{
                  id: category.id,
                  name: category.name,
                }}
                onSuccess={fns.reload}
              />
            </DialogContent>
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={category.nonConformities.length > 0}
                className="cursor-pointer"
                size={"icon"}
                variant="destructive"
              >
                <Trash />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>Delete this category</AlertDialogHeader>
              Are you sure? This action can't be undone
              <AlertDialogFooter>
                <AlertDialogAction
                  onClick={async () => {
                    try {
                      await deleteNonConformityType(row.original.id);
                      toast.success("Category deleted successfully");
                      fns.reload();
                    } catch (error) {
                      toast.error("Ocurrió un error al eliminar la categoría");
                    }
                  }}
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
