"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { SupplierRuleDialog } from "./components/supplier-rule-dialog";
import { SupplierRule } from "@/types/supplier-rules";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { DeleteAlertDialogComponent } from "./components/alert-dialog";

export default function SupplierRulesPage() {
  const [rules, setRules] = useState<SupplierRule[]>([]);
  const [form, setForm] = useState({
    supplierName: "",
    day: "",
    allocatedCapacity: 0,
    tolerance: 0,
    deliveryEmail: "",
  });
  const [editingRule, setEditingRule] = useState<SupplierRule | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<SupplierRule | null>(null);

  const fetchRules = async () => {
    const res = await fetch("/api/supplier-rules");
    setRules(await res.json());
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const openAddDialog = () => {
    setEditingRule(null);
    setForm({ supplierName: "", day: "", allocatedCapacity: 0, tolerance: 0, deliveryEmail: "" });
    setOpenDialog(true);
  };

  const openEditDialog = (rule: SupplierRule) => {
    setEditingRule(rule);
    setForm(rule);
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      const method = editingRule ? "PUT" : "POST";
      const res = await fetch("/api/supplier-rules", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingRule ? { ...form, id: editingRule.id } : form
        ),
      });

      if (!res.ok) {
        let details = "";
        try {
          const data = await res.json();
          details = data?.message || data?.error || "";
        } catch (err) {
          // ignore JSON parsing failure
        }

        return toast.error(`Error saving rule${details ? `: ${details}` : ""}`);
      }

      toast.success(
        editingRule ? "Rule updated successfully" : "Rule added successfully"
      );
      fetchRules();
      setOpenDialog(false);
    } catch (error: any) {
      toast.error(
        `Unexpected error: ${error?.message || "Something went wrong"}`
      );
    }
  };

  const handleDelete = (rule: SupplierRule) => {
    setSelectedRule(rule);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRule) return;

    try {
      const res = await fetch("/api/supplier-rules", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedRule.id }),
      });

      if (!res.ok) {
        let details = "";
        try {
          const data = await res.json();
          details = data?.message || data?.error || "";
        } catch {}

        return toast.error(`Delete failed${details ? `: ${details}` : ""}`);
      }

      toast.success("Rule deleted");
      fetchRules();
    } catch (error: any) {
      toast.error(
        `Unexpected error: ${error?.message || "Something went wrong"}`
      );
    } finally {
      setDeleteDialogOpen(false);
      setSelectedRule(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Supplier Rules</h1>

      <Button className="mb-4" onClick={openAddDialog}>
        Add Supplier Rule
      </Button>

      <DataTable columns={columns(openEditDialog, handleDelete)} data={rules} />

      <SupplierRuleDialog
        open={openDialog}
        setOpen={setOpenDialog}
        form={form}
        setForm={setForm}
        editingRule={editingRule}
        handleSave={handleSave}
      />
      <DeleteAlertDialogComponent
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        selectedRule={selectedRule}
        confirmDelete={confirmDelete}
      />
    </div>
  );
}
