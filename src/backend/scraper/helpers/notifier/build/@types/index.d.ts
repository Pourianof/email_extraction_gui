export interface BaseNofier<T extends string = string> {
  addListener: (eventName: T, data: ListenCallback) => Listener<T>;
}
export interface NotifierMembers<T extends string = string>
  extends BaseNofier<T> {
  clearify: (eventName: T) => void;
  trigger: (event: T, data?: any) => void;
}
export default class Notifier<T extends string = string>
  implements NotifierMembers<T>
{
  private async;
  private listeners;
  constructor(async?: boolean);
  addListener(eventName: T, listenerCb: ListenCallback): Listener<T>;
  isListening(eventName: T): boolean;
  clearify(eventName: string): boolean;
  trigger(eventName: T, data?: any): void;
  private notifyListeners;
}

export declare class LinkedListHandler<T extends LinkableItem = LinkableItem> {
  _first?: T;
  _last?: T;
  append(item: T): void;
  clearList(): boolean;
  hasItem(): boolean;
  protected unLink(item: LinkableItem): void;
}
export declare class LinkableItem {
  _handler?: LinkedListHandler;
  _previous?: LinkableItem;
  _next?: LinkableItem;
}

export type ListenCallback = (event: { eventName: string; data: any }) => void;
export declare class Listener<T extends string> extends LinkableItem {
  private listen;
  isInvoking: boolean;
  private pendings?;
  get hasPendings(): boolean;
  constructor(listen: ListenCallback);
  invoke(eventName: T, data?: any): void;
  _invoke(eventName: T, data?: any): void;
  scheduleEvent(eventName: T, data?: any): void;
  private isCanceled;
  cancel(): void;
}
export declare class ListenersHandler extends LinkedListHandler<Listener<any>> {
  hasListeners(): boolean;
  append(item: Listener<any>): void;
  cancelListening(listener: Listener<any>): void;
}

export declare class PendingEvent extends LinkableItem {
  private listener;
  private eventName;
  private data?;
  constructor(listener: Listener<any>, eventName: string, data?: any);
  dispatch(): void;
}
export declare class PendingEventsHandler extends LinkedListHandler<PendingEvent> {
  private isPaused;
  private isScheduled;
  start(): void;
  private unShift;
  private schedule;
  cancel(): void;
  pause(): void;
}
