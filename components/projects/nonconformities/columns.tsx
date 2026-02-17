"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  CheckCheck,
  Clock,
  Edit,
  Trash,
  User,
  X,
} from "lucide-react";

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
import NonConformityForm from "./form";
import { Badge } from "@/components/ui/badge";

export type NonConformityRow = {
  id: string;
  title: string;
  status: string;
  priority: string;
  type: { id: string; name: string };
  assignedTo: { id: string; name: string; email: string };
  media: { id: string; fileId: string }[];
  createdAt: Date;
  description: string;
  expected: string;
  actual: string;
  typeId: string;
  assignedToId: string;
};

export const columns = (fns: {
  sprintId: string;
  reload: () => void;
  deleteElement: (id: string) => void;
}): ColumnDef<NonConformityRow>[] => [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "type.name",
    header: "Category",
    cell: ({ row }) => row.original.type?.name ?? "",
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      // Different colors for different priorities with background like a badge
      switch (row.original.priority) {
        case "CRITICAL":
          return (
            <Badge className="bg-red-500 text-white font-bold">
              {row.original.priority}
            </Badge>
          );
        case "HIGH":
          return (
            <Badge className="bg-yellow-500 text-white font-bold">
              {row.original.priority}
            </Badge>
          );
        case "MEDIUM":
          return (
            <Badge className="bg-green-600 text-white font-bold">
              {row.original.priority}
            </Badge>
          );
      }
      return (
        <Badge className="bg-gray-500 text-white font-bold">
          {row.original.priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      // Different colors for different priorities with background like a badge
      switch (row.original.status) {
        case "NEW":
          return (
            <Badge className="bg-gray-500 text-white font-bold">
              {row.original.status}
            </Badge>
          );
        case "ASSIGNED":
          return (
            <Badge className="flex items-center gap-1 bg-yellow-600 text-white font-bold">
              <User />
              {row.original.status}
            </Badge>
          );
        case "IN_PROGRESS":
          return (
            <Badge className="flex items-center gap-1 bg-gray-700 text-white font-bold">
              <Clock />
              {row.original.status}
            </Badge>
          );
        case "PENDING_QA":
          return (
            <Badge className="bg-blue-600 text-white font-bold">
              {row.original.status}
            </Badge>
          );
        case "CLOSED":
          return (
            <Badge className="flex items-center gap-1 bg-green-600 text-white font-bold">
              <CheckCheck />
              {row.original.status}
            </Badge>
          );
        case "REOPENED":
          return (
            <Badge className="bg-yellow-600 text-white font-bold">
              <User />
              {row.original.status}
            </Badge>
          );
      }
    },
  },
  {
    accessorKey: "assignedTo.name",
    header: "Assigned to",
    cell: ({ row }) => row.original.assignedTo?.name ?? "",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </span>
      );
    },
    cell: ({ row }) => <div>{row.original.createdAt.toDateString()}</div>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const nc = row.original;

      return (
        <div className="space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="default">
                <Edit />
              </Button>
            </DialogTrigger>
            <DialogContent
              onInteractOutside={(e) => {
                e.preventDefault();
              }}
            >
              <DialogHeader>Update non conformity</DialogHeader>
              <NonConformityForm
                sprintId={fns.sprintId}
                initialData={{
                  id: nc.id,
                  title: nc.title,
                  description: nc.description,
                  expected: nc.expected,
                  typeId: nc.typeId,
                  priority: nc.priority,
                  status: nc.status,
                  assignedToId: nc.assignedToId,
                  media: nc.media,
                }}
                onSuccess={fns.reload}
              />
            </DialogContent>
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size={"sm"} variant="destructive">
                <Trash />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>Delete this non conformity</AlertDialogHeader>
              Are you sure? This action can't be undone
              <AlertDialogFooter>
                <AlertDialogAction
                  onClick={() => fns.deleteElement(nc.id)}
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
