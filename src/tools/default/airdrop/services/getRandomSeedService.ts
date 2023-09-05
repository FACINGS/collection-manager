import { api } from '@libs/api';
import { AxiosResponse } from 'axios';

interface DataProps {
  data: any;
}

export async function getRandomSeedService(): Promise<
  AxiosResponse<DataProps>
> {
  try {
    const response = await api.get('https://www.random.org/strings/', {
      params: {
        num: 1,
        len: 8,
        digits: 'on',
        upperalpha: 'on',
        loweralpha: 'on',
        unique: 'on',
        format: 'plain',
        rnd: 'new',
      },
    });

    return response.data.trim();
  } catch (error) {
    console.error('Error fetching random seed:', error.message);
    return null;
  }
}
