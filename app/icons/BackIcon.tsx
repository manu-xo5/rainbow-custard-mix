import type { SVGProps } from 'react';
import type { JSX } from 'react/jsx-runtime';

export default function BackIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <line x1="9.30697" y1="0.394676" x2="0.306969" y2="7.39468" stroke="currentColor"></line>
      <line x1="2.3254" y1="9.62037" x2="9.3254" y2="15.6204" stroke="currentColor"></line>
      <line y1="7.5" x2="16" y2="7.5" stroke="currentColor"></line>
    </svg>
  )
}
