export class LinkedListHandler<T extends {}> {
  protected _first?: LinkedItem<T>;
  protected _last?: LinkedItem<T>;

  get first() {
    return this._first;
  }

  get last() {
    return this._last;
  }

  private _length = 0;
  get length() {
    return this._length;
  }

  adopt(item: string): void;
  adopt(item: LinkedItem<T>): void;
  adopt(item: any): void {
    if (!(item instanceof LinkedItem)) {
      item = new LinkedItem(item);
    }

    if (!this._first) {
      this._first = this._last = item;
    } else {
      const last = this._last!;
      this._last = item;
      last._next = item;
      item._previous = last;
    }
    this._length++;

    item._handler = this;
  }

  remove(item: LinkedItem<T>) {
    const next = item._next;
    const prev = item._previous;

    if (next) {
      next._previous = prev;
    }

    if (prev) {
      prev._next = next;
    }
    this._length--;
    item._next = item._previous = item._handler = undefined;
  }
}

export class LinkedItem<T extends {}> {
  constructor(readonly item: T) {}
  _next?: LinkedItem<T>;
  _previous?: LinkedItem<T>;
  _handler?: LinkedListHandler<T>;

  get next() {
    return this._next;
  }

  get previous() {
    return this._previous;
  }
}
