interface ChevronRightIconProps {
  className?: string;
}

export default function ChevronRightIcon({ className }: ChevronRightIconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className} aria-hidden="true">
      <path d="M5 3l4 4-4 4" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
