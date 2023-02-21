import { forwardRef, ReactNode, LinkHTMLAttributes, Ref } from 'react';
import Link from 'next/link';

interface ChainLinkProps extends LinkHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
}

function ChainLinkComponent(
  { href, children, ...rest }: ChainLinkProps,
  ref: Ref<HTMLInputElement | any>
) {
  return (
    <Link href={href} ref={ref} {...rest}>
      {children}
    </Link>
  );
}

export const ChainLink = forwardRef(ChainLinkComponent);
