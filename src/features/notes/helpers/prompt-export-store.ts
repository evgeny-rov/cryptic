import { promptExport } from '../../files';

export default async (store: string) => {
  const currentDate = new Date().toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const name = 'Cryptic Vault';

  const filename = `${name} - ${currentDate}.cryptic`;

  promptExport(filename, JSON.stringify(store));
};
