const LOCKED_DEPARTMENTS = [
  { name: "Scouting", teaser: "Reports, comps, and draft boards" },
  { name: "Analytics", teaser: "Player value models and projections" },
  { name: "Medical", teaser: "Injury logs and availability flags" },
  { name: "Contracts", teaser: "Cap sheets and negotiation history" },
  { name: "Coaching", teaser: "Rotation notes and staff priorities" },
];

function LockIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0"
      aria-hidden="true"
    >
      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5.5 7V4.8a2.5 2.5 0 0 1 5 0V7" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export default function DepartmentRail() {
  return (
    <nav
      aria-label="Departments"
      className="flex flex-col gap-1 p-3 border-r border-hairline bg-surface h-full"
    >
      <button
        type="button"
        aria-current="page"
        className="text-left px-3 py-2 rounded-md text-sm font-medium bg-surface-2 text-text"
      >
        Front Office
      </button>

      <div className="mt-2 flex flex-col gap-1">
        {LOCKED_DEPARTMENTS.map((dept) => (
          <div key={dept.name} className="group relative">
            <button
              type="button"
              disabled
              className="w-full text-left px-3 py-2 rounded-md text-sm text-text-muted flex items-center justify-between gap-2 cursor-not-allowed hover:bg-surface-2/60 transition-colors"
            >
              <span>{dept.name}</span>
              <LockIcon />
            </button>
            <div
              role="tooltip"
              className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 w-56 z-20 rounded-md border border-hairline bg-surface-2 px-3 py-2 text-xs text-text-muted opacity-0 translate-x-[-4px] transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0"
            >
              <span className="text-text font-medium">{dept.name}:</span> {dept.teaser}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}
