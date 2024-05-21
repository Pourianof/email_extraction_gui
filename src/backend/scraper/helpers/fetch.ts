import https from 'https';
import http from 'http';
import path from 'path';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { PassThrough } from 'stream';
import mergeData from './streamToString';

export async function fetchURL(url: string) {
  const proxy = process.env.https_proxy ?? process.env.http_proxy;
  const bridge = new PassThrough();

  const agent: undefined | HttpsProxyAgent<any> = proxy
    ? new HttpsProxyAgent(proxy, {
        headers: {
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
        },
      })
    : undefined;

  https
    .get(url, {
      agent,
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
      },
    })
    .on('response', (resp) => {
      resp.pipe(bridge);
    })
    .end();

  const result = await mergeData(bridge);
  return result;
}

import fs from 'fs';

export async function downloadFile(url: string, outputPath: string) {
  const writer = fs.createWriteStream(outputPath);

  let protocol: typeof https.get;
  if (url.startsWith('https')) {
    protocol = https.get;
  } else if (url.startsWith('http')) {
    protocol = http.get;
  }
  return new Promise<string>((res, rej) => {
    protocol(url)
      .on('response', (resp) => {
        resp
          .on('data', (data) => {
            writer.write(data);
          })
          .on('end', () => (writer.end(), res(outputPath)))
          .on('error', (err) => rej(err));
      })
      .end();
  });
}
