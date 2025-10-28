"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch"; // or use a Button if you prefer
import { toast } from "sonner";
interface QuizStatusToggleProps {
  id: string;
  initialStatus: boolean;
  onStatusChange?: (newStatus: boolean) => void;
}

export function QuizStatusToggle({
  id,
  initialStatus,
  onStatusChange,
}: QuizStatusToggleProps) {
  const [isActive, setIsActive] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quiz/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (res.ok) {
        setIsActive(!isActive);
        toast.success(
          `Quiz ${!isActive ? "activated" : "deactivated"} successfully`
        );
        onStatusChange?.(!isActive);
      } else {
        toast.error("Failed to update quiz status");
      }
    } catch (err) {
      toast.error("Error updating quiz status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={isActive}
        onCheckedChange={handleToggle}
        disabled={loading}
      />
      <span
        className={`text-sm font-medium ${
          isActive ? "text-green-600" : "text-red-500"
        }`}>
        {isActive ? "Active" : "Inactive"}
      </span>
    </div>
  );
}
