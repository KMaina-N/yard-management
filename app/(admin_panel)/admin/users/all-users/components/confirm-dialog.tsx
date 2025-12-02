

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  actionLabel: string;
  isDangerous?: boolean;
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, onClose, onConfirm, title, description, actionLabel, isDangerous, isLoading }) => (
  <AlertDialog open={open} onOpenChange={onClose}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <div className="flex justify-end gap-3">
        <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} disabled={isLoading} className={isDangerous ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}>
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {actionLabel}
        </AlertDialogAction>
      </div>
    </AlertDialogContent>
  </AlertDialog>
);

export default ConfirmDialog;