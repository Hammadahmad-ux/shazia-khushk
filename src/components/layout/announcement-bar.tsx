interface AnnouncementBarProps {
  message?: string;
}

export function AnnouncementBar({ message }: AnnouncementBarProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="flex min-h-[var(--announcement-height)] items-center justify-center border-b border-accent bg-accent px-5 py-1 text-center text-[0.625rem] font-medium tracking-[0.14em] text-surface uppercase">
      {message}
    </div>
  );
}
