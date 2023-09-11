import Link from 'next/link';
import {
  Fire,
  Parachute,
  Prohibit,
  PuzzlePiece,
  ShareFat,
  Tag,
} from '@phosphor-icons/react';

export function ToolsContainer({ tools, chainKey }) {
  const handleIcons = (tool) => {
    switch (tool) {
      case 'airdrop':
        return <Parachute size={40} />;
      case 'burn':
        return <Fire size={40} />;
      case 'cancel-sales':
        return <Prohibit size={40} />;
      case 'create-sales':
        return <Tag size={40} />;
      case 'transfer':
        return <ShareFat size={40} />;
      default:
        return <PuzzlePiece size={40} />;
    }
  };

  return (
    <>
      {tools.map((item) => (
        <div key={item.tool}>
          <Link
            href={{
              pathname: `/${chainKey}/tools/${item.tool}`,
              query: { type: 'default' },
            }}
            className="flex flex-col w-full justify-center items-center gap-md bg-zinc-800 rounded-xl cursor-pointer hover:scale-105 duration-300 p-8"
          >
            <div className="flex flex-row items-center gap-8 bg-zinc-800 text-white rounded-md w-full">
              <div className="text-zinc-900 p-3.5 rounded-full bg-white">
                {handleIcons(item.tool)}
              </div>
              <div className="flex flex-col gap-2">
                <span className="headline-2">{item.label}</span>
                <span className="body-2">{item.description}</span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
}
