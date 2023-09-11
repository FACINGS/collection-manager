import { TrashSimple } from '@phosphor-icons/react';

interface TableProps {
  list: string[];
  exception?: string;
  action: (string) => void;
}

export function Table({ list, action, exception }: TableProps) {
  return (
    <table className="w-full bg-zinc-800 border border-zinc-700 text-zinc-500 rounded overflow-hidden focus-within:text-white">
      <tbody>
        {list.map((item, index) => (
          <tr
            key={index}
            className="flex flex-1 flex-row justify-between odd:bg-zinc-800 even:bg-zinc-700 border border-zinc-700 text-zinc-400 w-full"
          >
            <td className="p-4">{item}</td>
            {item !== exception && (
              <td>
                <button
                  type="button"
                  className="hover:text-white p-4"
                  onClick={() => action(item)}
                >
                  <TrashSimple size={24} />
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
