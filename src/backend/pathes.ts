import path from 'path';

export const APP_DIR = path.join(__dirname, '..', '..');
export const STATIC_FILES = path.join(APP_DIR, 'static');
export const TEMP_FILES = path.join(APP_DIR, 'temp');
export const TEMP_EXCELS = path.join(TEMP_FILES, 'excels');
export const RESOURCE_DIR = path.join(APP_DIR, 'resources');
export const CHROME_DIR = path.join(RESOURCE_DIR, 'chrome');
export const CHROME_USER_DATA = path.join(CHROME_DIR, 'chrome_data');
