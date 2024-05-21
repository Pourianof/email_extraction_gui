import path from 'path';
import { RealBrowserMimicker } from '../helpers/browserManager';
import extracter from '../index';

const ELSEVIER_JOURNAL_URL = `https://www.sciencedirect.com/journal/aace-clinical-case-reports/vol/10/issue/2`;
const TEST_MAIN_PATH = path.join(__dirname, 'test_util_path');

(async function () {
  await extracter([ELSEVIER_JOURNAL_URL], {
    browserUserDataPath: path.join(TEST_MAIN_PATH, 'chrome_dir'),
    ouputPath() {
      return path.join(TEST_MAIN_PATH, 'output');
    },
    tempPath: path.join(TEST_MAIN_PATH, 'temp'),
  });
})();
