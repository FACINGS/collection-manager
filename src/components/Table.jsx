import { TrashSimple } from 'phosphor-react';

export function Table({ list, action }) {
  return (
    <table className="w-full bg-neutral-800 border border-neutral-700 text-neutral-500 rounded overflow-hidden focus-within:text-white">
      <tbody>
        {list.map((item, index) => (
          <tr
            key={index}
            className="flex flex-1 flex-row justify-between odd:bg-neutral-800 even:bg-neutral-700 border border-neutral-700 text-neutral-400 w-full"
          >
            <td className="p-4">{item}</td>
            <td>
              <button
                type="button"
                className="hover:text-white p-4"
                onClick={() => action(item)}
              >
                <TrashSimple size={24} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
