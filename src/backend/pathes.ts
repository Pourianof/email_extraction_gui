import { app } from "electron";
import path from "path";

export const APP_DIR = app.isPackaged
  ? path.join(__dirname, "..", "..", "..")
  : path.join(__dirname, "..", "..");
export const STATIC_FILES = path.join(APP_DIR, "static");
export const TEMP_FILES = path.join(
  app.getPath("temp"),
  "ausmt_author_extractor"
);
export const ASSET_DIR = path.join(APP_DIR, "assets");
export const DEPENDENCIES_DIR = path.join(ASSET_DIR, "dependencies");

export const TEMP_EXCELS = path.join(TEMP_FILES, "excels");
export const RESOURCE_DIR = path.join(APP_DIR, "assets");
export const CHROME_DIR = path.join(TEMP_FILES, "chrome");
export const CHROME_USER_DATA = path.join(CHROME_DIR, "chrome_data");
