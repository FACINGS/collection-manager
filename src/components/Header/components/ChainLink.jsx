import { forwardRef } from 'react';
import Link from 'next/link';

function ChainLinkComponent({ href, children, ...rest }, ref) {
  return (
    <Link href={href}>
      <a ref={ref} {...rest}>
        {children}
      </a>
    </Link>
  );
}

export const ChainLink = forwardRef(ChainLinkComponent);
