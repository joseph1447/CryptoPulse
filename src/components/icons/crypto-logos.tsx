import type { SVGProps } from "react";

const logos: Record<string, (props: SVGProps<SVGSVGElement>) => JSX.Element> = {
  BTC: (props) => (
    <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false">
      <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 32-16 32zm0-2.667c7.364 0 13.333-5.97 13.333-13.333S23.364 2.667 16 2.667 2.667 8.636 2.667 16 8.636 29.333 16 29.333z" fill="#F7931A" />
      <path d="M21.503 16.89c.402-2.335-1.004-3.55-3.59-4.32l.745-2.982-1.78-.445-.73 2.926c-.45-.112-.904-.22-1.358-.332l.738-2.953-1.78-.445-.745 2.982c-.377-.086-.75-.17-1.12-.257l.004-.017-2.34-.585-.59 2.36s1.315.31 1.28.324c.737.184.81.65.787.97l-1.12 4.482c.03.008-.07-.02-.112-.032a.856.856 0 00-.814-.197c-.737-.185-1.28-.325-1.28-.325l-1.08 2.456s2.12.514 2.07.49c.45.112.78.252.96.42.19.18.21.494.13.81l-1.42 5.684c-.06.26-.26.565-.77.442 0 0-1.314-.315-1.29-.327l-.59 2.36 2.34.584c.39.097.777.197 1.16.292l-.744 2.98 1.78.445.73-2.925c.48.12.95.236 1.41.347l-.736 2.952 1.78.445.744-2.98c2.934.53 5.148.22 6.034-2.62.73-2.343-.05-3.71-2.006-4.662.98-.22 1.74-.89 1.95-2.14zm-5.02 5.346c-.53 2.12-3.44.96-4.48.68l.86-3.44c1.04.26 3.98.81 3.62 2.76zm.6-4.89c-.49 1.96-3.05.99-3.9.77l.79-3.16c.86.21 3.44.7 3.11 2.39z" fill="#FFF" />
    </svg>
  ),
  ETH: (props) => (
    <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false">
        <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 32-16 32z" fill="#627EEA"/>
        <path d="M16 3.2v9.933l6.067 3.587L16 3.2z" fill="#FFFFFF" fillOpacity=".602"/>
        <path d="M16 3.2L9.933 16.72 16 13.133V3.2z" fill="#FFFFFF"/>
        <path d="M16 22.467v6.333l6.067-9.92L16 22.467z" fill="#FFFFFF" fillOpacity=".602"/>
        <path d="M16 28.8v-6.333L9.933 18.88 16 28.8z" fill="#FFFFFF"/>
        <path d="M16 21.067l6.067-4.347-6.067-3.587v7.934z" fill="#FFFFFF" fillOpacity=".2"/>
        <path d="M9.933 16.72l6.067 4.347v-7.934L9.933 16.72z" fill="#FFFFFF" fillOpacity=".602"/>
    </svg>
  ),
  BNB: (props) => (
    <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false">
      <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 32-16 32z" fill="#F3BA2F"/>
      <path d="M16.14 8.44l4.86 4.86-2.58 2.58-4.86-4.86 2.58-2.58z" fill="#FFFFFF"/>
      <path d="M21 13.3l-2.58 2.58-2.43 2.43L13.42 15.7l2.58-2.58 4.86-4.86L21 8.44v4.86z" fill="#FFFFFF"/>
      <path d="M13.42 15.7l-2.43 2.43-2.58 2.58L11 23.56l4.86-4.86-2.44-2.43.01.01-2.43-2.43z" fill="#FFFFFF"/>
      <path d="M16 18.28l2.43-2.43 2.58-2.58v4.86l-2.58 2.58L16 23.13v-4.85z" fill="#FFFFFF"/>
      <path d="M8.44 11l4.86 4.86L11 18.29 8.44 15.7V11z" fill="#FFFFFF"/>
    </svg>
  ),
  ADA: (props) => (
     <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false">
        <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 32-16 32z" fill="#0D1E30"/>
        <path d="M18.66 2.8a.4.4 0 01.2.33v7.35c0 .32-.17.6-.43.75l-4.5 2.6-3.8-2.19a.4.4 0 01-.2-.33V3.13c0-.32.17-.6.43-.75l4.5-2.6a.8.8 0 01.8 0zM12.23 15l1.3 2.2-2.1 1.25-3.3-1.92a.4.4 0 01-.2-.33V9.82c0-.13.06-.25.17-.32l1.83-1.06 2.3 4.56zM19.77 15l-2.3 4.56 1.83 1.06a.4.4 0 00.17.32v6.38a.4.4 0 01-.2.33l-3.3 1.92-2.1-1.25 1.3-2.2-1.3-2.2 2.1-1.24 3.3 1.92a.4.4 0 00.2.33v-6.38a.4.4 0 010-.01.4.4 0 01-.17-.32l-1.83-1.06-1.57 3.08.87 1.5.87 1.51zm-7.9-1.94l-2-1.15a.4.4 0 00-.43-.1l-1.3.75a.4.4 0 01-.37 0L6.43 12a.4.4 0 010-.7l2-1.15c.1-.06.2-.06.3 0l1.3.75c.1.07.24.07.35 0l1.3-.75a.4.4 0 01.35 0zM22.2 13.06l1.3-.75a.4.4 0 00.35 0l1.3.75a.4.4 0 01.35 0l1.3-.75a.4.4 0 000-.7l-1.3-.75a.4.4 0 00-.35 0l-1.3.75a.4.4 0 01-.35 0l-1.3-.75a.4.4 0 00-.3 0l-1.3.75a.4.4 0 01-.37 0l-1.3-.75a.4.4 0 00-.43.1l-2 1.15a.4.4 0 00-.06.7z" fill="#0033AD"/>
    </svg>
  ),
  SOL: (props) => (
    <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false">
      <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 32-16 32z" fill="url(#sol-gradient)"/>
      <path d="M7.65 10.3h16.7v2.4H7.65v-2.4zM7.65 14.8h11.9v2.4H7.65v-2.4zM7.65 19.3h16.7v2.4H7.65v-2.4z" fill="#FFFFFF"/>
      <defs>
        <linearGradient id="sol-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9945FF"/>
          <stop offset="100%" stopColor="#14F195"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  XRP: (props) => (
    <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false">
      <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 32-16 32z" fill="#23292F"/>
      <path d="M16.9 13.3c0-.2-.1-.3-.3-.3h-1.8c-.3 0-.5.2-.6.5l-1.1 4.5-.8-3.1s0-.1-.1-.1h-.1c0 .1-.1.1-.1.2l-1.4 5.6-1.1-4.4c0-.2-.2-.4-.5-.4h-2c-.2 0-.3.1-.3.3s.1.3.3.3h1.8l2 8c.1.2.3.4.5.4h.3c.2 0 .4-.2.5-.4l1.4-5.6 1.1 4.5c.1.2.3.4.5.4h.3c.2 0 .4-.2.5-.4l2-8h1.8c.2 0 .3-.1.3-.3zm5.8-3.9l-2.2-2.2c-.1-.1-.3-.1-.4 0l-2.2 2.2c-.1.1-.1.3 0 .4l2.2 2.2c.1.1.3.1.4 0l2.2-2.2c.1-.1.1-.3 0-.4zm-14 0l-2.2-2.2c-.1-.1-.3-.1-.4 0l-2.2 2.2c-.1.1-.1.3 0 .4l2.2 2.2c.1.1.3.1.4 0l2.2-2.2c.1-.1.1-.3 0-.4z" fill="#FFFFFF"/>
    </svg>
  ),
  DOGE: (props) => (
    <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false">
      <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 32-16 32z" fill="#C3A634"/>
      <path d="M16 29.333c-7.363 0-13.333-5.97-13.333-13.333S8.637 2.667 16 2.667c7.363 0 13.333 5.97 13.333 13.333S23.363 29.333 16 29.333z" fill="#FFEAB6"/>
      <path d="M22.016 19.344a7.973 7.973 0 01-1.258.118 8.082 8.082 0 01-8.08-8.082c0-.62.072-1.226.208-1.812a8.08 8.08 0 017.925-6.42 8.08 8.08 0 018.08 8.08c0 2.21-2.008 4.212-2.008 4.212l-2.86 4.672-2.007-2.788zm-2.812-5.46a2.91 2.91 0 002.908-2.908 2.91 2.91 0 00-2.908-2.908 2.91 2.91 0 00-2.908 2.908 2.91 2.91 0 002.908 2.908z" fill="#C3A634"/>
    </svg>
  ),
  DOT: (props) => (
    <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false">
      <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 32-16 32z" fill="#E6007A"/>
      <path d="M20.9 14.5c0-2.7-2.2-4.9-4.9-4.9s-4.9 2.2-4.9 4.9 2.2 4.9 4.9 4.9 4.9-2.2 4.9-4.9z" fill="#FFFFFF"/>
      <path d="M19.1 22.3a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" fill="#FFFFFF"/>
    </svg>
  ),
  LINK: (props) => (
     <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false">
        <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 32-16 32z" fill="#375BD2"/>
        <path d="M10.8 13.9l-2 2a.6.6 0 000 .8l5.2 5.2a.6.6 0 00.8 0l2-2-5.2-5.2a.6.6 0 00-.8 0z" fill="#FFFFFF"/>
        <path d="M21.2 18.1l2-2a.6.6 0 000-.8l-5.2-5.2a.6.6 0 00-.8 0l-2 2 5.2 5.2a.6.6 0 00.8 0z" fill="#FFFFFF"/>
    </svg>
  ),
  LTC: (props) => (
    <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false">
      <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 32-16 32z" fill="#BFBBBB"/>
      <path d="M14.9 23.5l-2.6-1-5.6-2.1-1 2.8 5.7 2.1c.3.1.6 0 .8-.2l2.7-1.6zm6.8-13.8l-5.6-2.1L15 4.8l5.6 2.1c.3.1.4.4.3.7l-1 2.8c-.1.3-.4.4-.7.3zM21 17.5l-3.3-1.2-1.3 3.6 3.8 1.4c.3.1.6 0 .8-.2l1.6-2.8c.2-.3.1-.6-.2-.8z" fill="#FFFFFF"/>
    </svg>
  ),
  MATIC: (props) => (
     <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false">
      <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 32-16 32z" fill="#8247E5"/>
      <path d="M11.5 15.1l4-2.3 2.1 1.2-4 2.3-2.1-1.2zM16 8.5l-4.5 2.6v5.2l4.5-2.6V8.5zm.9 10.9l4-2.3-2.1-1.2-4 2.3 2.1 1.2zM21.4 16.3V11l-4.5 2.6v5.2l4.5-2.5z" fill="#FFFFFF"/>
    </svg>
  ),
  AVAX: (props) => (
    <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false">
      <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 32-16 32z" fill="#E84142"/>
      <path d="M21.1 9.1l-3-5.2a.6.6 0 00-1 0L8.9 21.6l5.1 8.8c.3.5.9.5 1.2 0l10.3-17.8a.6.6 0 00-.4-1z" fill="#FFFFFF"/>
      <path d="M22.8 23.3l-2.1 3.6a.6.6 0 01-1 0L5.3 10.4a.6.6 0 01.5-1l3.1 5.4 5 8.6 8.9-15.5z" fill="#FFFFFF" fillOpacity=".8"/>
    </svg>
  ),
  DEFAULT: (props) => (
    <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false">
      <path fill="var(--muted-foreground)" d="M16,2C8.268,2,2,8.268,2,16s6.268,14,14,14s14-6.268,14-14S23.732,2,16,2z M16,24c-0.552,0-1-0.448-1-1v-4 c0-0.552,0.448-1,1-1s1,0.448,1,1v4C17,23.552,16.552,24,16,24z M16.001,15.999c-0.552,0-1-0.447-1-1v-2.001 c0-0.552,0.448-1,1-1s1,0.448,1,1v2.001C17.001,15.552,16.553,15.999,16.001,15.999z"/>
    </svg>
  ),
};

export function CryptoLogo({ symbol, ...props }: { symbol: string } & SVGProps<SVGSVGElement>) {
  const LogoComponent = logos[symbol] || logos.DEFAULT;
  return <LogoComponent {...props} />;
}
