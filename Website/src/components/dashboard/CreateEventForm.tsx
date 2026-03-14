"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormDatePicker from "./FormDatePicker";
import SegmentedControl from "./SegmentedControl";
import type { RegistrationMode } from "./types";

interface CreateEventFormProps {
  onCancel: () => void;
}

export default function CreateEventForm({ onCancel }: CreateEventFormProps) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [manager, setManager] = useState("jake-hamann");
  const [members, setMembers] = useState("");
  const [eventUrl, setEventUrl] = useState("");
  const [leadDefault, setLeadDefault] = useState("");
  const [regMode, setRegMode] = useState<RegistrationMode>("qr-code");
  const [service, setService] = useState("xpress-leads");
  const [authKey, setAuthKey] = useState("");
  const [exhibitorId, setExhibitorId] = useState("");

  return (
    <div className="flex h-full flex-col">
      {/* Form fields */}
      <div className="flex-1 space-y-5">
        <FormInput
          label="Name"
          placeholder="Enter event name"
          value={name}
          onChange={setName}
          tooltip="The display name for this event"
        />

        <FormDatePicker
          label="Event Dates"
          startDate={startDate}
          endDate={endDate}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
          tooltip="Start and end dates for the event"
        />

        <FormInput
          label="Event Location"
          placeholder="City, State"
          value={location}
          onChange={setLocation}
          icon={MapPin}
        />

        <FormSelect
          label="Event Manager"
          value={manager}
          onChange={setManager}
          options={[
            { value: "jake-hamann", label: "Jake Hamann" },
            { value: "sarah-chen", label: "Sarah Chen" },
            { value: "mike-torres", label: "Mike Torres" },
            { value: "anna-kim", label: "Anna Kim" },
          ]}
        />

        <FormSelect
          label="Event Members"
          value={members}
          onChange={setMembers}
          placeholder="Select members"
          tooltip="Team members assigned to this event"
          options={[
            { value: "1", label: "1 Members" },
            { value: "2", label: "2 Members" },
            { value: "3", label: "3 Members" },
            { value: "4", label: "4 Members" },
          ]}
        />

        <FormInput
          label="Event URL"
          placeholder="Please enter event URL"
          value={eventUrl}
          onChange={setEventUrl}
        />

        <FormSelect
          label="Lead Defaults"
          value={leadDefault}
          onChange={setLeadDefault}
          placeholder="Select a property to set default"
          options={[
            { value: "hot", label: "Hot Lead" },
            { value: "warm", label: "Warm Lead" },
            { value: "cold", label: "Cold Lead" },
          ]}
        />

        {/* Divider */}
        <div
          className="my-2"
          style={{ borderTop: "1px solid var(--dash-border)" }}
        />

        <SegmentedControl value={regMode} onChange={setRegMode} />

        <FormSelect
          label="Select a Service"
          value={service}
          onChange={setService}
          options={[
            { value: "xpress-leads", label: "XPress Leads" },
            { value: "a2z", label: "A2Z Events" },
            { value: "cvent", label: "Cvent" },
            { value: "custom", label: "Custom Integration" },
          ]}
        />

        <FormInput
          label="Authentication Key"
          placeholder="Please enter authentication key"
          value={authKey}
          onChange={setAuthKey}
        />

        <FormInput
          label="Exhibitor ID"
          placeholder="Please enter exhibitor ID"
          value={exhibitorId}
          onChange={setExhibitorId}
        />
      </div>

      {/* Footer buttons */}
      <div
        className="mt-6 flex items-center justify-end gap-3 pt-4"
        style={{ borderTop: "1px solid var(--dash-border)" }}
      >
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-5 py-2.5 text-sm font-medium transition-colors duration-150"
          style={{
            color: "var(--dash-text-muted)",
            border: "1px solid var(--dash-border)",
            background: "transparent",
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          className="bg-dash-action rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-opacity duration-150 hover:opacity-90"
        >
          Save
        </button>
      </div>
    </div>
  );
}
