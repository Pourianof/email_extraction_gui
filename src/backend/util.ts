import path from 'path';
import { Readable } from 'stream';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

async function* readableToIterator(stream: Readable) {
  for await (const chunk of stream) {
    yield chunk;
  }
}

export function toBrowserReadableStream(stream: Readable) {
  const iterator = readableToIterator(stream);
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(new Uint8Array(value));
      }
    },
  });
}
