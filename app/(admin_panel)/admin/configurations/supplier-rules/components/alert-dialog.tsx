import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SupplierRule } from "@/types/supplier-rules";
interface AlertDialogProps {
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  selectedRule: SupplierRule | null;
  confirmDelete: () => void;
}
export const DeleteAlertDialogComponent = ({
  deleteDialogOpen,
  setDeleteDialogOpen,
  selectedRule,
  confirmDelete,
}: AlertDialogProps) => {
  return (
    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Supplier Rule?</AlertDialogTitle>
          <AlertDialogDescription>
            {selectedRule
              ? `Are you sure you want to delete the rule for ${selectedRule.supplierName} on ${selectedRule.day}? This action cannot be undone.`
              : ""}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
