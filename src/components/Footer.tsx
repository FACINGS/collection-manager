import {
  TwitterLogo,
  DiscordLogo,
  GlobeSimple,
  GithubLogo,
} from '@phosphor-icons/react';

export function Footer() {
  return (
    <footer className="container border-t border-neutral-700 flex flex-col md:flex-row gap-4 justify-between items-center py-8 mt-8">
      <div className="flex items-center gap-1">
        <span className="body-3">Created by</span>
        <a
          href="https://kryptokrauts.com"
          target="_blank"
          rel="noreferrer"
          className="font-bold"
        >
          <div className="flex item-center">
            <svg
              width={48}
              height={28}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 388.12 318.8"
            >
              <defs>
                <style>
                  {
                    '.cls-1{fill:#66bb6a;}.cls-2{fill:#00c853;}.cls-3{fill:#43a047;}'
                  }
                </style>
              </defs>
              <title>{'logo_svg'}</title>
              <path
                className="cls-1"
                d="M96.15,338.82S-51.38,233.84,30.9,83.47c0,0,93.62-17,150.37,85.12C181.27,168.59,116,197,96.15,338.82Z"
                transform="translate(-5.94 -40.6)"
              />
              <path
                className="cls-2"
                d="M199.29,154.4S153.89,75,108.5,75c0,0,127.67-99.3,210,39.72C318.45,114.68,239,117.52,199.29,154.4Z"
                transform="translate(-5.94 -40.6)"
              />
              <path
                className="cls-3"
                d="M125.52,339.89c7.19-1.41,29.64-6.52,58.28-19.58-6.53-14-16.43-46.43,3.69-88.89a5.67,5.67,0,0,1,10.26,4.85c-18.22,38.47-9.28,67.24-3.72,79.16a316.82,316.82,0,0,0,30-17.1c-5-11.25-11.67-35.51,3.2-66.91a5.67,5.67,0,0,1,10.26,4.85c-12.18,25.71-7.76,45.68-3.86,55.58a306.83,306.83,0,0,0,26.12-20.49c-2.54-9-3.65-23,4.36-39.94a5.67,5.67,0,0,1,10.26,4.85c-5,10.51-5.65,19.44-4.86,26.17a298.54,298.54,0,0,0,37-42.86,9.93,9.93,0,0,1,16.19,11.5A324.3,324.3,0,0,1,146.84,355.26C206.4,365.79,366.45,373,394.06,154.4,394.06,154.4,153.48,77,125.52,339.89Z"
                transform="translate(-5.94 -40.6)"
              />
            </svg>
            <span className="text-white text-2xl">kryptokrauts</span>
          </div>
        </a>
      </div>
      <div className="flex gap-4">
        <div>
          <a
            href="https://github.com/kryptokrauts/nft-manager"
            target="_blank"
            className="btn btn-square btn-ghost btn-small"
            rel="noreferrer"
            aria-label="Github"
          >
            <GithubLogo size={24} />
          </a>
        </div>
        <div>
          <a
            href="https://x.com/soon_market"
            target="_blank"
            className="btn btn-square btn-ghost btn-small"
            rel="noreferrer"
            aria-label="X.com"
          >
            {/* TODO change to X, see https://github.com/phosphor-icons/homepage/issues/323 */}
            <TwitterLogo size={24} />
          </a>
        </div>
        <div>
          <a
            href="https://discord.gg/KtVVaYy6b3"
            target="_blank"
            className="btn btn-square btn-ghost btn-small"
            rel="noreferrer"
            aria-label="Discord"
          >
            <DiscordLogo size={24} />
          </a>
        </div>
        <div>
          <a
            href="https://soon.market"
            target="_blank"
            className="btn btn-square btn-ghost btn-small"
            rel="noreferrer"
            aria-label="Soon.Market"
          >
            <GlobeSimple size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}
