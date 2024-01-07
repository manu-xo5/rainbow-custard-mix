import type { SVGProps } from 'react';
import type { JSX } from 'react/jsx-runtime';

export default function AddIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <line x1="8.5" x2="8.5" y2="9" stroke="#E5E5E5"></line>
      <line x1="8.5" y1="10" x2="8.5" y2="17" stroke="#E5E5E5"></line>
      <line y1="8.5" x2="17" y2="8.5" stroke="#E5E5E5"></line>
    </svg>
  )
}
