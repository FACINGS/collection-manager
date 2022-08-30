import { aaEndpoint } from '@configs/globalsConfig';

export async function getInventory(
  accountName,
  updateInventory = () => {},
  error = () => {}
) {
  try {
    fetch(
      `${aaEndpoint}/atomicassets/v1/assets?owner=${accountName}&page=1&limit=1000&order=desc&sort=transferred_at_time`
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.data && result.data.length > 0) {
          updateInventory(result.data);
        } else {
          console.debug('Inventory empty.');
          updateInventory([]);
        }
      });
  } catch (e) {
    console.error(e);
    error(e.message);
  }
}
