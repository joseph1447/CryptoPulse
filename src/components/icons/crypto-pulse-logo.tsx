import type { SVGProps } from "react";

export function CryptoPulseLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 12h5l2 8 4-16 2 8h5" />
      <path d="M12 2a10 10 0 1 0 10 10" />
    </svg>
  );
}
