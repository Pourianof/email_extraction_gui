import fs from 'fs';
import path from 'path';
import { rimrafSync } from 'rimraf';
import { DIST_MAIN_PATH, DIST_RENDERER_PATH } from '../webpack.pathes';

export default function deleteSourceMaps() {
  if (fs.existsSync(DIST_MAIN_PATH))
    rimrafSync(path.join(DIST_MAIN_PATH, '*.js.map'), {
      glob: true,
    });
  if (fs.existsSync(DIST_RENDERER_PATH))
    rimrafSync(path.join(DIST_RENDERER_PATH, '*.js.map'), {
      glob: true,
    });
}
