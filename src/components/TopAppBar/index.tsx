import { useState } from 'react';
import { useRouter } from 'next/router';

import { Chain } from './components/Chain';
import { NavItem } from './components/NavItem';
import { Login } from './components/Login';
import { List, X } from '@phosphor-icons/react';

import { chainKeyDefault } from '@configs/globalsConfig';

export function TopAppBar() {
  const router = useRouter();
  const chainKey = router.query.chainKey ?? chainKeyDefault;

  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-center justify-between top-0 left-0 sticky z-40 w-full py-4 bg-neutral-900 px-4 md:px-8">
      <Chain chainKey={chainKey} />
      <nav className="flex gap-4">
        <div
          data-open={open}
          className="flex md:items-center w-full h-[calc(100vh-5.5rem)] md:h-auto bg-neutral-900 flex-col md:flex-row absolute right-0 top-[5.5rem] md:static md:transform-none data-[open=false]:-left-full duration-300 data-[open=false]:opacity-0 data-[open=false]:md:opacity-100"
        >
          <NavItem href={`/${chainKey}`} onClick={() => setOpen(false)}>
            My Collections
          </NavItem>
          <NavItem href={`/${chainKey}/tools`} onClick={() => setOpen(false)}>
            Tools
          </NavItem>
          <NavItem
            href="https://soon.market/explore?utm_medium=navbar&utm_source=nft-manager"
            onClick={() => setOpen(false)}
            target="_blank"
          >
            Explore
          </NavItem>
          <NavItem
            href="https://soon.market/sell?utm_medium=navbar&utm_source=nft-manager"
            onClick={() => setOpen(false)}
            target="_blank"
          >
            Sell
          </NavItem>
          <NavItem
            href="https://soon.market/soon-spot-nfts?utm_medium=navbar&utm_source=nft-manager"
            onClick={() => setOpen(false)}
            target="_blank"
          >
            Promote
          </NavItem>
          <NavItem href={`/${chainKey}/about`} onClick={() => setOpen(false)}>
            About
          </NavItem>
          <Login chainKey={chainKey} />
        </div>
        <button
          type="button"
          className="p-3 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={32} /> : <List size={32} />}
        </button>
      </nav>
    </header>
  );
}
