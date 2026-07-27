const DECISIONS = [
  { label: "Reyes extension window", detail: "9 days left" },
  { label: "Banks extension window", detail: "21 days left" },
];

const WATCHLIST = ["Marcus Reyes", "Tyrell Banks", "Andre Kostas"];

function Widget({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-hairline bg-surface px-4 py-3 flex flex-col gap-2">
      <h3 className="font-mono text-[11px] uppercase tracking-wide text-text-muted">{title}</h3>
      {children}
    </div>
  );
}

export default function CockpitWidgets({
  documents,
  onAddDocument,
  onRemoveDocument,
}: {
  documents: UploadedDocument[];
  onAddDocument: (document: UploadedDocument) => void;
  onRemoveDocument: (id: string) => void;
}) {
  return (
    <aside aria-label="Cockpit widgets" className="flex flex-col gap-3">
      <Widget title="Decisions on deck">
        <ul className="flex flex-col gap-1.5">
          {DECISIONS.map((d) => (
            <li key={d.label} className="flex items-center justify-between gap-2 text-sm">
              <span className="text-text">{d.label}</span>
              <span className="font-mono text-xs text-text-muted shrink-0">{d.detail}</span>
            </li>
          ))}
        </ul>
      </Widget>

      <Widget title="Cap snapshot">
        <p className="font-mono text-xl text-text">$8.2M</p>
        <p className="text-xs text-text-muted">below the luxury apron</p>
      </Widget>

      <Widget title="Watchlist">
        <ul className="flex flex-col gap-1 text-sm text-text">
          {WATCHLIST.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </Widget>

      <DocumentIntake
        documents={documents}
        onAdd={onAddDocument}
        onRemove={onRemoveDocument}
      />
    </aside>
  );
}
import DocumentIntake from "./DocumentIntake";
import type { UploadedDocument } from "@/lib/uploaded-docs";
