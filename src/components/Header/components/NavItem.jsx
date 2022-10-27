import { useRouter } from 'next/router';
import Link from 'next/link';

export function NavItem({ children, href, ...rest }) {
  const router = useRouter();
  const isNavItemActive = router.asPath === href;

  return (
    <Link href={href}>
      <a
        className={`text-base font-bold p-4 ${
          isNavItemActive ? 'text-white' : 'text-neutral-400'
        }`}
        {...rest}
      >
        {children}
      </a>
    </Link>
  );
}
