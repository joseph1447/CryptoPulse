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
  // Add other logos similarly...
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
