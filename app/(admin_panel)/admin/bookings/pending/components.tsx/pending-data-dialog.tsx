import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
const PendingDataDialog = () => {
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pending Data</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          This is a dialog for pending data.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

export default PendingDataDialog