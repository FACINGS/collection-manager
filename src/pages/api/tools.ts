import { promises as fs } from 'fs';

export default async function handler(req, res) {
  try {
    const { path } = req.query;
    const dirPath = `src/tools/${path}`;
    const files = await fs.readdir(dirPath, { withFileTypes: true });

    const toolInfo = [];

    for (const file of files) {
      if (file.isDirectory()) {
        const configPath = `${dirPath}/${file.name}/config.ts`;
        try {
          const configContent = await fs.readFile(configPath, 'utf-8');
          const name = configContent.match(/name: '(.+?)'/)?.[1];
          const page = configContent.match(/page: '(.+?)'/)?.[1];
          const description = configContent.match(
            /description: '([^']+)'/s
          )?.[1];
          if (name) {
            toolInfo.push({
              tool: file.name,
              label: name,
              page,
              description,
            });
          }
        } catch (error) {
          console.error(`Error reading ${configPath}`, error);
        }
      }
    }

    res.status(200).json(toolInfo);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}
