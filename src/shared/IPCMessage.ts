export interface IPCMessage<T extends {} = {}> {
  status: {
    code: number;
    message: string;
  };
  data?: T;
}
