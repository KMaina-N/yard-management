"use client";
import React, { useState } from "react";
import { User } from "./columns";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmDialog from "./confirm-dialog";
import { EditDialog } from "./edit-dialog";
import { activateUser, editUser } from "@/app/actions/admin/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ActionsCellProps {
  user: User;
  onToggleActive: (user: User) => void;
  onDelete: (user: User) => void;
}

interface EditFormData {
  name: string;
  email: string;
  company: string;
  role: string;
}

// ------------------- Actions Popover -------------------
interface ActionsPopoverProps {
  onEditClick: () => void;
  onToggleClick: () => void;
  onDeleteClick: () => void;
  user: User;
}

const ActionsPopover: React.FC<ActionsPopoverProps> = ({
  onEditClick,
  onToggleClick,
  onDeleteClick,
  user,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-accent"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <div className="flex flex-col gap-1">
          <button
            onClick={() => {
              onEditClick();
              setIsOpen(false);
            }}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md"
          >
            <Edit className="h-4 w-4 text-blue-500" /> Edit
          </button>
          {!user.accountActive && (
            <>
              <Separator className="my-1" />
              <button
                onClick={() => {
                  onToggleClick();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md"
              >
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                {"Activate"}
              </button>
            </>
          )}
          <Separator className="my-1" />
          <button
            onClick={() => {
              onDeleteClick();
              setIsOpen(false);
            }}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md"
          >
            <Trash2 className="h-4 w-4 text-destructive" /> Delete
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const ActionsCell: React.FC<ActionsCellProps> = ({
  user,
  onToggleActive,
  onDelete,
}) => {
  const [dialog, setDialog] = useState<{
    type: "edit" | "toggle" | "delete" | null;
    isOpen: boolean;
  }>({ type: null, isOpen: false });
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const openDialog = (type: "edit" | "toggle" | "delete") =>
    setDialog({ type, isOpen: true });
  const closeDialog = () => setDialog({ type: null, isOpen: false });

  const editUserMutation = useMutation({
    mutationKey: ["users"],
    mutationFn: async (updatedUser: User) => {
      // remove id from updatedUser before sending
      const payload: Omit<User, "id"> & { id?: string } = { ...updatedUser };
      delete payload.id;
      const res = await editUser(user.id, payload);
      return res;
    },
    onSuccess: () => {
      toast.success("User updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleEdit = (updatedUser: User) => {
    setIsLoading(true);
    editUserMutation.mutate(updatedUser);
    setTimeout(() => {
      setIsLoading(false);
      closeDialog();
    }, 500);
  };

  const activateMutation = useMutation({
    mutationKey: ["bookings"],
    mutationFn: async (userId: string) => {
      const res = await activateUser(userId);
      return res;
    },
    onSuccess: (data) => {
      console.log("User activation toggled successfully.");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleActivate = () => {
    console.log("Activating user...");
    // activateUser(user.id);
    activateMutation.mutate(user.id);
  };

  const handleConfirm = () => {
    setIsLoading(true);
    if (dialog.type === "toggle") handleActivate();
    else if (dialog.type === "delete") onDelete(user);
    setTimeout(() => {
      setIsLoading(false);
      closeDialog();
    }, 500);
  };

  const dialogConfig = {
    toggle: {
      title: user.accountActive ? "Deactivate User" : "Activate User",
      description: user.accountActive
        ? `${user.name || user.email} will be deactivated.`
        : `${user.name || user.email} will be activated.`,
      actionLabel: user.accountActive ? "Deactivate" : "Activate",
      isDangerous: !user.accountActive,
    },
    delete: {
      title: "Delete User",
      description: `This will permanently delete ${user.name || user.email}.`,
      actionLabel: "Delete",
      isDangerous: true,
    },
  };

  return (
    <>
      <ActionsPopover
        user={user}
        onEditClick={() => openDialog("edit")}
        onToggleClick={() => openDialog("toggle")}
        onDeleteClick={() => openDialog("delete")}
      />

      {dialog.type === "edit" && (
        <EditDialog
          user={user}
          open={dialog.isOpen}
          onClose={closeDialog}
          onSave={handleEdit}
          isLoading={isLoading}
        />
      )}

      {(dialog.type === "toggle" || dialog.type === "delete") && (
        <ConfirmDialog
          open={dialog.isOpen}
          onClose={closeDialog}
          onConfirm={handleConfirm}
          {...dialogConfig[dialog.type]}
          isLoading={isLoading}
        />
      )}
    </>
  );
};
