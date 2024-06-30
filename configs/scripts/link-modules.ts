import fs from 'fs';
import { APP_NODE_MODULES, SRC_NODE_MODULES } from '../webpack.pathes';

if (!fs.existsSync(SRC_NODE_MODULES) && fs.existsSync(APP_NODE_MODULES)) {
  fs.symlinkSync(APP_NODE_MODULES, SRC_NODE_MODULES, 'junction');
}
