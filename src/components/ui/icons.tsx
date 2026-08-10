import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const sharedProps: IconProps = {
  "aria-hidden": true,
  fill: "none",
  focusable: "false",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 1.7,
  viewBox: "0 0 24 24",
};

export function MenuIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <path d="M4 7h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  );
}

export function BagIcon(props: IconProps) {
  return (
    <svg {...sharedProps} {...props}>
      <path d="M5 8.5h14l-1 11H6l-1-11Z" />
      <path d="M9 9V6.5a3 3 0 0 1 6 0V9" />
    </svg>
  );
}

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="currentColor" focusable="false" viewBox="0 0 24 24" {...props}>
      <path d="M17.47 14.38c-.29-.15-1.73-.85-2-.95-.27-.1-.46-.15-.66.15-.2.29-.76.95-.93 1.15-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.49.1-.19.05-.36-.02-.51-.08-.15-.66-1.6-.91-2.19-.24-.58-.48-.5-.66-.5h-.56c-.19 0-.51.07-.77.36-.27.29-1.02 1-1.02 2.44s1.04 2.83 1.19 3.03c.15.19 2.05 3.13 4.96 4.39.69.3 1.24.48 1.66.61.7.22 1.34.19 1.84.12.56-.08 1.73-.71 1.98-1.39.24-.68.24-1.27.17-1.39-.07-.12-.26-.19-.55-.34Z" />
      <path
        clipRule="evenodd"
        d="M12.02 2C6.5 2 2.02 6.48 2.02 12c0 1.85.5 3.58 1.38 5.07L2 22l5.06-1.33A9.94 9.94 0 0 0 12.02 22c5.52 0 10-4.48 10-10s-4.48-10-10-10Zm0 18.2a8.16 8.16 0 0 1-4.16-1.14l-.3-.18-3 .79.8-2.92-.2-.3A8.19 8.19 0 1 1 20.2 12a8.2 8.2 0 0 1-8.18 8.2Z"
        fillRule="evenodd"
      />
    </svg>
  );
}
