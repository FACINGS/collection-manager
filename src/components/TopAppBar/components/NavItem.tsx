import { LinkHTMLAttributes, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface NavItemProps extends LinkHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  href?: string;
}

export function NavItem({ children, href, ...rest }: NavItemProps) {
  const router = useRouter();
  const isNavItemActive = router.asPath === href;

  return (
    <Link
      href={href}
      className={`md:text-base text-2xl font-bold p-4 ${
        isNavItemActive ? 'text-white' : 'text-neutral-400'
      }`}
      {...rest}
    >
      {children}
    </Link>
  );
}
