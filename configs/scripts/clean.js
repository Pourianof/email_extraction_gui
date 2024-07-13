import { sync } from 'rimraf';
import fs from 'fs';
import { DIST_PATH, BUILD_PATH } from '../webpack.pathes';

const foldersToRemove = [DIST_PATH, BUILD_PATH];

foldersToRemove.forEach((folder) => {
  if (fs.existsSync(folder)) sync(folder);
});
