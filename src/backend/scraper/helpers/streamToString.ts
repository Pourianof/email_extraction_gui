import { Readable } from 'stream';

export default function mergeData(s: Readable): Promise<string> {
  const segments: Buffer[] = [];
  return new Promise((res, rej) => {
    s.on('data', (d) => {
      segments.push(Buffer.from(d));
    })
      .on('end', () => {
        res(Buffer.concat(segments).toString('utf-8'));
      })
      .on('error', (err) => {
        rej(err);
      });
  });
}
