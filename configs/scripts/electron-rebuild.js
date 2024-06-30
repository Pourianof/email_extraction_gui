import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { dependencies } from '../../release/app/package.json';
import { APP_NODE_MODULES, APP_PATH } from '../webpack.pathes';

if (
  Object.keys(dependencies || {}).length > 0 &&
  fs.existsSync(APP_NODE_MODULES)
) {
  const electronRebuildCmd = `${path.resolve(
    APP_NODE_MODULES,
    '.bin',
    'electron-rebuild'
  )} --force --types prod,dev,optional --module-dir .`;

  execSync(electronRebuildCmd, {
    cwd: APP_PATH,
    stdio: 'inherit',
  });
}
