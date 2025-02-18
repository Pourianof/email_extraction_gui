import path from 'path';

export const DLL_PATH = path.join(__dirname, '.dll');

export const APP_PATH = path.join(__dirname, '..');

export const ASSET_DIR = path.join(APP_PATH, 'assets');
export const DEPENDENCIES_DIR = path.join(ASSET_DIR, 'dependencies');

export const SRC_PATH = path.join(APP_PATH, 'src');

export const APP_NODE_MODULES = path.join(APP_PATH, 'node_modules');

export const SRC_NODE_MODULES = path.join(SRC_PATH, 'node_modules');

export const BUILD_PATH = path.join(APP_PATH, 'build');

export const STATIC_PATH = path.join(APP_PATH, 'static');

export const HTML_TEMPLATE_PATH = path.join(STATIC_PATH, 'index.html');

export const BACKEND_PATH = path.join(SRC_PATH, 'backend');

export const FRONTEND_PATH = path.join(SRC_PATH, 'frontend');
export const VIEWS_PATH = path.join(APP_PATH, 'views');

export const RELEAS_PATH = path.join(APP_PATH, 'release');
export const RELEASE_APP_PATH = path.join(RELEAS_PATH, 'app');
export const APP_DIST_PATH = path.join(RELEASE_APP_PATH, 'dist');

export const DIST_PATH = APP_DIST_PATH;
export const DIST_MAIN_PATH = path.join(DIST_PATH, 'main');
export const DIST_RENDERER_PATH = path.join(DIST_PATH, 'renderer');

export const RESOURCES_PATH = path.join(APP_PATH, 'resources');

export const STATIC_DIR = path.join(APP_PATH, 'static');
