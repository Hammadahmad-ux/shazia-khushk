import { SearchIcon } from "@/components/ui/icons";

interface SearchTriggerProps {
  compact?: boolean;
}

export function SearchTrigger({ compact = false }: SearchTriggerProps) {
  return (
    <button
      aria-label="Search products (coming soon)"
      className="flex min-h-11 min-w-11 items-center justify-center gap-2 text-sm font-medium text-foreground disabled:cursor-not-allowed"
      disabled
      title="Search will be connected when catalog search is implemented"
      type="button"
    >
      <SearchIcon className="size-5" />
      {!compact && <span>Search</span>}
    </button>
  );
}
