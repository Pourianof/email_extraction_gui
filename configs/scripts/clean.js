import { sync } from 'rimraf';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const appDirectory = path.resolve(scriptDirectory, '../..');
const foldersToRemove = [
  path.join(appDirectory, 'release', 'app', 'dist'),
  path.join(appDirectory, 'build'),
];

foldersToRemove.forEach((folder) => {
  if (fs.existsSync(folder)) sync(folder);
});
