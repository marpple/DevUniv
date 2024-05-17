type GreaterThanZero<T extends number> = T extends 0
  ? never
  : T extends number
    ? T extends -1
      ? never
      : T
    : never;

function delay<T>(time: number, value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), time));
}

function* map<A, B>(f: (a: A) => B, iterable: Iterable<A>): IterableIterator<B> {
  for (const a of iterable) {
    yield f(a);
  }
}

async function fromAsync<T>(iterable: Iterable<Promise<T>>) {
  const arr: Awaited<T>[] = [];
  for await (const a of iterable) {
    arr.push(a);
  }
  return arr;
}

function* take<T>(length: number, iterable: Iterable<T>) {
  const iterator = iterable[Symbol.iterator]();
  while (length-- > 0) {
    const { value, done } = iterator.next();
    if (done) break;
    yield value;
  }
}

async function reduceAsync<A, B>(
  f: (acc: A, a: B) => Promise<A> | A,
  acc: A,
  iterable: Iterable<B>,
) {
  for await (const b of iterable) {
    acc = await f(acc, b);
  }
  return acc;
}

class PromiseExecutor<T> {
  promise: Promise<T> | null = null;
  fulfilled = false;

  constructor(private executor: () => Promise<T>) {}

  execute(): this {
    this.promise = this.executor();
    void this.promise.then(() => (this.fulfilled = true));
    return this;
  }
}

async function concurrent<T, N extends number>(
  limit: GreaterThanZero<N>,
  fs: (() => Promise<T>)[],
) {
  if (limit === 1) return fromAsync(map((f) => f(), fs));

  const promiseExecutors = fs.map((f) => new PromiseExecutor(f));
  const executeIter = map((pe) => pe.execute(), promiseExecutors);
  await reduceAsync(
    async (pes, pe) => {
      await Promise.race(pes.map((pe) => pe.promise));
      return [...pes.filter((pe) => !pe.fulfilled), pe];
    },
    [...take(limit - 1, executeIter)],
    executeIter,
  );
  return fromAsync(promiseExecutors.map((pe) => pe.promise!));
}

function log<T>(value: T) {
  console.log('start:', value);
  return value;
}

export async function main() {
  console.time();
  console.log(
    await concurrent(2, [
      () => delay(500, log('a')),
      () => delay(1000, log('b')),
      () => delay(1500, log('c')),
      () => delay(500, log('d')),
      () => delay(1000, log('e')),
      () => delay(1500, log('f')),
    ]),
  );
  console.timeEnd();
}
