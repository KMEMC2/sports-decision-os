"use client";

import { useRef, useState } from "react";
import type { UploadedDocument } from "@/lib/uploaded-docs";

const DEPARTMENTS: UploadedDocument["department"][] = [
  "Scouting", "Analytics", "Medical", "Contracts", "Coaching", "Operations",
];

export default function DocumentIntake({
  documents,
  onAdd,
  onRemove,
}: {
  documents: UploadedDocument[];
  onAdd: (document: UploadedDocument) => void;
  onRemove: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [department, setDepartment] = useState<UploadedDocument["department"]>("Scouting");
  const [visibility, setVisibility] = useState<UploadedDocument["visibility"]>("Front Office");
  const [error, setError] = useState("");

  async function ingest(file: File) {
    setError("");
    if (file.size > 250_000) {
      setError("File exceeds the 250 KB demo limit.");
      return;
    }
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !["txt", "md", "csv", "json"].includes(extension)) {
      setError("Use TXT, MD, CSV, or JSON for this prototype.");
      return;
    }
    const content = (await file.text()).trim();
    if (!content) {
      setError("The selected document is empty.");
      return;
    }
    onAdd({
      id: `upload-${Date.now()}`,
      name: file.name,
      department,
      visibility,
      content: content.slice(0, 40_000),
      addedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <section className="document-intake" aria-label="Session evidence upload">
      <div className="intake-heading">
        <div><span>SESSION EVIDENCE</span><strong>Connect a document</strong></div>
        <em>{documents.length} ADDED</em>
      </div>
      <p>Uploaded evidence is available to the live Anthropic synthesis and cross-department chat for this session.</p>
      <div className="intake-fields">
        <label>Department
          <select value={department} onChange={(event) => setDepartment(event.target.value as UploadedDocument["department"])}>
            {DEPARTMENTS.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>Visibility
          <select value={visibility} onChange={(event) => setVisibility(event.target.value as UploadedDocument["visibility"])}>
            <option>Private</option><option>Front Office</option><option>Org-wide</option>
          </select>
        </label>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.md,.csv,.json,text/plain,text/csv,application/json"
        onChange={(event) => { const file = event.target.files?.[0]; if (file) void ingest(file); }}
      />
      {error && <span className="intake-error">{error}</span>}
      {documents.length > 0 && <ul>
        {documents.map((document) => <li key={document.id}>
          <div><strong>{document.name}</strong><span>{document.department} / {document.visibility} / {document.addedAt}</span></div>
          <button type="button" onClick={() => onRemove(document.id)} aria-label={`Remove ${document.name}`}>×</button>
        </li>)}
      </ul>}
      <small>Session-only · clears on reload · no database persistence</small>
    </section>
  );
}
