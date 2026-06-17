"use client";

import { useState } from "react";
import Button from "@/components/Common/Button";
import Input from "@/components/Common/Input";
import Modal from "@/components/Common/Modal";
import Select from "@/components/Common/Select";

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern (ET)" },
  { value: "America/Chicago", label: "Central (CT)" },
  { value: "America/Los_Angeles", label: "Pacific (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
];

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Optional preview of the post being scheduled. */
  preview?: string;
  /** Disables the form while a schedule request is in flight. */
  busy?: boolean;
  /**
   * Called with the chosen date/time/timezone. The parent is responsible for
   * closing the modal (e.g. on success) so errors can keep it open.
   */
  onSchedule: (when: { date: string; time: string; tz: string }) => void;
}

export default function ScheduleModal({
  isOpen,
  onClose,
  preview,
  busy = false,
  onSchedule,
}: ScheduleModalProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [tz, setTz] = useState(TIMEZONES[0].value);
  const [error, setError] = useState("");

  function handleSchedule() {
    if (!date) {
      setError("Please pick a date.");
      return;
    }
    setError("");
    onSchedule({ date, time, tz });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule post"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={handleSchedule} disabled={busy}>
            {busy ? "Scheduling…" : "Schedule"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {preview && (
          <div className="rounded-md bg-mist p-3 text-sm text-gray-700">
            {preview}
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            error={error}
          />
          <Input
            label="Time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <Select
          label="Timezone"
          options={TIMEZONES}
          value={tz}
          onChange={(e) => setTz(e.target.value)}
        />
      </div>
    </Modal>
  );
}
