"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function YardDialog({ open, onOpenChange, onSave, yard }: { open: boolean; onOpenChange: (open: boolean) => void; onSave: (yard: any) => void; yard: any }) {
  const [form, setForm] = useState({ name: "", address: "", products: "" })

  useEffect(() => {
    if (yard) {
      setForm({
        name: yard.name,
        address: yard.address,
        products: yard.products.join(", "),
      })
    } else {
      setForm({ name: "", address: "", products: "" })
    }
  }, [yard])

  const handleSubmit = () => {
    const newYard = {
      ...yard,
      name: form.name,
      address: form.address,
      products: form.products.split(",").map((p) => p.trim()).filter(Boolean),
    }
    onSave(newYard)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{yard ? "Edit Yard" : "Add New Yard"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter yard name"
            />
          </div>
          <div className="space-y-1">
            <Label>Address</Label>
            <Textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Enter yard address"
            />
          </div>
          <div className="space-y-1">
            <Label>Products (comma separated)</Label>
            <Input
              value={form.products}
              onChange={(e) => setForm({ ...form, products: e.target.value })}
              placeholder="e.g. Steel, Paint, Pipes"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSubmit}>
              {yard ? "Save Changes" : "Add Yard"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
