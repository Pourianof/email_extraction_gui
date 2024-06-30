// Check if the renderer and main bundles are built
import path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import { DIST_MAIN_PATH, DIST_RENDERER_PATH } from '../webpack.pathes';

const mainPath = path.join(DIST_MAIN_PATH, 'main.js');
const rendererPath = path.join(DIST_RENDERER_PATH, 'renderer.js');

if (!fs.existsSync(mainPath)) {
  throw new Error(
    chalk.whiteBright.bgRed.bold(
      'The main process is not built yet. Build it by running "npm run build:main"'
    )
  );
}

if (!fs.existsSync(rendererPath)) {
  throw new Error(
    chalk.whiteBright.bgRed.bold(
      'The renderer process is not built yet. Build it by running "npm run build:renderer"'
    )
  );
}
