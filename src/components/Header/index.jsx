import { useRouter } from 'next/router';

import { Chain } from './components/Chain';
import { NavItem } from './components/NavItem';
import { Login } from './components/Login';

import { chainKeyDefault } from '@configs/globalsConfig';

export function Header() {
  const router = useRouter();
  const chainKey = router.query.chainKey ?? chainKeyDefault;

  return (
    <header className="flex items-center justify-between top-0 left-0 sticky z-40 w-full py-4 bg-neutral-900 px-4 md:px-8">
      <Chain chainKey={chainKey} />
      <nav className="flex gap-4">
        <div className="flex justify-around md:gap-4 bg-neutral-900 fixed md:relative bottom-0 left-0 w-full md:w-auto p-4 md:p-0">
          <NavItem href={`/${chainKey}`}>My Collections</NavItem>
          <NavItem href={`/${chainKey}/explorer`}>Explorer</NavItem>
          <NavItem href={`/${chainKey}/transfer`}>Transfer</NavItem>
          <NavItem href={`/${chainKey}/about`}>About</NavItem>
        </div>
        <Login chainKey={chainKey} />
      </nav>
    </header>
  );
}
