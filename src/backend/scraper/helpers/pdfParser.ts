import java_email_regex from './email_regex';
import child_process from 'child_process';
import path from 'path';
import mergeData from './streamToString';
import { PassThrough } from 'stream';

const parserPath = path.resolve(
  __dirname,
  '..',
  '..',
  'dependencies',
  'extract_from_pdf',
  'extract_from_pdf.jar'
);

export default function parsePdfForEmail(
  pdfPath: string,
  useArticleBaseRange?: boolean
): Promise<string[]>;
export default function parsePdfForEmail(
  pdfPath: string,
  options: {
    startPage?: number;
    endPage?: number;
  }
): Promise<string[]>;
export default function parsePdfForEmail(
  pdfPath: string,
  options: any = true
): Promise<string[]> {
  let pageRange: string = '';

  if (options) {
    if (typeof options == 'boolean') {
      if (options) {
        pageRange = '1-3';
      } else {
        // no range = total pdf
      }
    } else if (typeof options == 'object') {
      let validRange = false;
      if (Number.isInteger(options.startPage)) {
        pageRange = `${options.startPage}-`;
        validRange ||= true;
      }
      if (Number.isInteger(options.endPage)) {
        if (!pageRange) {
          pageRange += '-';
        }
        pageRange += `${options.endPage}`;

        validRange ||= true;
      }

      if (!validRange) {
        throw new Error('Not valid range entered.');
      }
    }
  }

  const args: string[] = pageRange
    ? ['-jar', parserPath, '-r', pageRange, '-i', `"${pdfPath}"`]
    : ['-jar', parserPath, '-i', `"${pdfPath}"`];

  return new Promise<string[]>(async (res, rej) => {
    const parser = child_process.spawn('java', args, { shell: true });

    const rStream = new PassThrough();
    rStream.push(java_email_regex);
    rStream.pipe(parser.stdin);

    console.log('Piping...');
    parser.stderr.pipe(process.stderr);
    const result = await mergeData(parser.stdout);
    parser.kill();
    const emails = result.split(' ');
    res(emails);
  });
}
