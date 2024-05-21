import path from 'path';

export const APP_PATH = path.join(__dirname, '..');

export const STATIC_PATH = path.join(APP_PATH, 'static');

export const HTML_TEMPLATE_PATH = path.join(STATIC_PATH, 'index.html');

export const SRC_PATH = path.join(APP_PATH, 'src');

export const BACKEND_PATH = path.join(SRC_PATH, 'backend');

export const FRONTEND_PATH = path.join(SRC_PATH, 'frontend');

export const DIST_PATH = path.join(APP_PATH, 'dist');

export const RESOURCES_PATH = path.join(APP_PATH, 'resources');
