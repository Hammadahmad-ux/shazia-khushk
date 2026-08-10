"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { updateFulfillmentStatus } from "@/lib/admin/actions/order-actions";
import { FULFILLMENT_STATUSES, FULFILLMENT_STATUS_LABEL, type FulfillmentStatus } from "@/lib/admin/orders/fulfillment-status";

export function OrderStatusForm({ orderId, initialStatus }: { orderId: string; initialStatus: FulfillmentStatus }) {
  const router = useRouter();
  const [status, setStatus] = useState<FulfillmentStatus>(initialStatus);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    const result = await updateFulfillmentStatus(orderId, status);

    setIsSaving(false);
    if (result.status === "error") {
      setError(result.message);
      return;
    }
    router.refresh();
  }

  return (
    <form className="admin-form-grid" data-cols="1" onSubmit={handleSubmit}>
      <div className="admin-field">
        <label htmlFor="fulfillment-status">Fulfillment Status</label>
        <select id="fulfillment-status" onChange={(event) => setStatus(event.target.value as FulfillmentStatus)} value={status}>
          {FULFILLMENT_STATUSES.map((option) => (
            <option key={option} value={option}>
              {FULFILLMENT_STATUS_LABEL[option]}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="checkout-field__error">{error}</p>}
      <button className="admin-button admin-button--primary" disabled={isSaving} type="submit">
        {isSaving ? "Saving…" : "Update Status"}
      </button>
    </form>
  );
}
