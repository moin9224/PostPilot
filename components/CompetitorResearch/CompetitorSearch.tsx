"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import Button from "@/components/Common/Button";
import Input from "@/components/Common/Input";

export default function CompetitorSearch({
  onAdd,
}: {
  onAdd: (url: string) => void;
}) {
  const [url, setUrl] = useState("");

  function handleAdd() {
    if (!url.trim()) return;
    onAdd(url.trim());
    setUrl("");
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Input
          label="Add a competitor"
          placeholder="https://linkedin.com/in/username"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
      </div>
      <Button onClick={handleAdd} className="sm:mb-0">
        <Plus className="h-4 w-4" /> Add Competitor
      </Button>
    </div>
  );
}
