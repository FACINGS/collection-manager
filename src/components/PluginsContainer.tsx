import Link from 'next/link';
import { Parachute, PuzzlePiece } from 'phosphor-react';

export function PluginsContainer({ plugins, chainKey }) {
  const handleIcons = (plugin) => {
    switch (plugin) {
      case 'airdrop':
        return <Parachute size={40} />;

      default:
        return <PuzzlePiece size={40} />;
    }
  };

  return (
    <>
      {plugins.map((item) => (
        <div key={item.plugin}>
          {item.page === 'plugins' && (
            <Link
              href={{
                pathname: `/${chainKey}/plugins/${item.plugin}`,
                query: { type: 'default' },
              }}
              className="flex flex-col w-full justify-center items-center gap-md bg-neutral-800 rounded-xl cursor-pointer hover:scale-105 duration-300 p-8"
            >
              <div className="flex flex-row items-center gap-8 bg-neutral-800 text-white rounded-md w-full">
                <div className="text-neutral-900 p-3.5 rounded-full bg-white">
                  {handleIcons(item.plugin)}
                </div>
                <div className="flex flex-col gap-2">
                  <span className="headline-2">{item.label}</span>
                  <span className="body-2">{item.description}</span>
                </div>
              </div>
            </Link>
          )}
        </div>
      ))}
    </>
  );
}
