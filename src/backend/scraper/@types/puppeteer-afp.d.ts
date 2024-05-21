declare module 'puppeteer-afp' {
  import { Page, Browser } from 'puppeteer';

  type Minus5To5 = -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5;
  type TwoPower0To4 = 2 | 4 | 8 | 16;
  type TwoPower5To8 = 32 | 64 | 128 | 256;
  type TwoPower10To13 = 1024 | 2048 | 8192;
  type TwoPower13To14 = 8192 | 16384;
  type TwoPower15 = 32768;
  type NumberSign = -1 | 1;

  interface ProtectOptions {
    canvasRgba?: [Minus5To5, Minus5To5, Minus5To5, Minus5To5]; //all these numbers can be from -5 to 5
    webglData?: {
      3379?: TwoPower13To14; //16384, 32768
      3386?: {
        0?: TwoPower13To14 | TwoPower15; // 8192, 16384, 32768
        1?: TwoPower13To14 | TwoPower15; // 8192, 16384, 32768
      };
      3410?: TwoPower0To4; // 2, 4, 8, 16
      3411?: TwoPower0To4; // 2, 4, 8, 16
      3412?: TwoPower0To4; // 2, 4, 8, 16
      3413?: TwoPower0To4; // 2, 4, 8, 16
      7938?: 'WebGL 1.0' | 'WebGL 1.0 (OpenGL)' | 'WebGL 1.0 (OpenGL Chromium)'; // "WebGL 1.0", "WebGL 1.0 (OpenGL)", "WebGL 1.0 (OpenGL Chromium)"
      33901?: {
        0?: 1 | TwoPower10To13;
        1?: 1 | TwoPower10To13; // 1, 1024, 2048, 4096, 8192
      };
      33902?: {
        0?: 1;
        1?: 1 | TwoPower10To13; // 1, 1024, 2048, 4096, 8192
      };
      34024?: TwoPower13To14; //16384, 32768
      34047?: TwoPower0To4; // 2, 4, 8, 16
      34076?: TwoPower13To14; //16384, 32768
      34921?: TwoPower0To4; // 2, 4, 8, 16
      34930?: TwoPower0To4; // 2, 4, 8, 16
      35660?: TwoPower0To4; // 2, 4, 8, 16
      35661?: TwoPower5To8; // 16, 32, 64, 128, 256
      35724?: 'WebGL GLSL ES'; // "WebGL", "WebGL GLSL", "WebGL GLSL ES", "WebGL GLSL ES (OpenGL Chromium)"
      36347?: 4096 | 8192; // 4096, 8192
      36349?: TwoPower10To13; // 1024, 2048, 4096, 8192
      37446?: 'Graphics' | 'HD Graphics' | 'Intel(R) HD Graphics'; // "Graphics", "HD Graphics", "Intel(R) HD Graphics"
    };
    fontFingerprint?: {
      noise?: -1 | 0 | 1 | 2; // -1, 0, 1, 2
      sign?: NumberSign; // -1, +1
    };
    audioFingerprint?: {
      getChannelDataIndexRandom?: number; // all values of Math.random() can be used
      getChannelDataResultRandom?: number; // all values of Math.random() can be used
      createAnalyserIndexRandom?: number; // all values of Math.random() can be used
      createAnalyserResultRandom?: number; // all values of Math.random() can be used
    };
    webRTCProtect?: boolean;
  }

  export function protectPage(
    page: Page,
    options?: ProtectOptions
  ): Promise<void>;
  export function protectedBrowser(
    browser: Browser,
    options?: ProtectOptions
  ): Promise<void>;
}
