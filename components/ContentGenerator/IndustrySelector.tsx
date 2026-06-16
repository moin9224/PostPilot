"use client";

import Select from "@/components/Common/Select";
import { INDUSTRIES } from "@/lib/constants";

export default function IndustrySelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select
      label="Industry"
      options={INDUSTRIES}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
