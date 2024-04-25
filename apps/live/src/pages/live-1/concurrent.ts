function delay<T>(time: number, value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), time));
}

interface File {
  name: string;
  body: string;
  size: number;
}

function getFile(name: string): Promise<File> {
  console.log(name);
  return delay(1000, { name, body: '...', size: 100 });
}

function* take<T>(length: number, iterable: Iterable<T>) {
  const iterator = iterable[Symbol.iterator]();
  while (length-- > 0) {
    const { value, done } = iterator.next();
    if (done) break;
    yield value;
  }
}

function* chunk<T>(size: number, iterable: Iterable<T>) {
  const iterator = iterable[Symbol.iterator]();
  while (true) {
    const arr = [
      ...take(size, {
        [Symbol.iterator]() {
          return iterator;
        },
      }),
    ];
    if (arr.length) yield arr;
    if (arr.length < size) break;
  }
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

async function concurrent2<T>(limit: number, fs: (() => Promise<T>)[]) {
  const result = await fromAsync(
    map(
      (ps) => Promise.all(ps),
      map((fs) => fs.map((f) => f()), chunk(limit, fs)),
    ),
  );

  return result.flat();
}

class FxIterator<T> {
  constructor(public iterable: Iterable<T>) {}

  chunk(size: number) {
    return fx(chunk(size, this.iterable));
  }

  map<U>(f: (a: T) => U): FxIterator<U> {
    return fx(map(f, this.iterable));
  }

  to<U>(f: (iterable: Iterable<T>) => U): U {
    return f(this.iterable);
  }
}

function fx<T>(iterable: Iterable<T>) {
  return new FxIterator(iterable);
}

async function concurrent<T>(limit: number, fs: (() => Promise<T>)[]) {
  const result: T[][] = [];
  for (let i = 0; i < fs.length / limit; i++) {
    const tmp: Promise<T>[] = [];
    for (let j = 0; j < limit; j++) {
      const f = fs[i * limit + j];
      if (f) {
        tmp.push(f());
      }
    }
    result.push(await Promise.all(tmp));
  }
  return result.flat();
}

async function concurrent4<T>(limit: number, fs: (() => Promise<T>)[]) {
  const arr = await fromAsync(
    [...chunk(limit, fs)].map((fs) => fs.map((f) => f())).map((ps) => Promise.all(ps)),
  );
  return arr.flat();
}

async function concurrent3<T>(limit: number, fs: (() => Promise<T>)[]) {
  return fx(fs)
    .chunk(limit)
    .map((fs) => fs.map((f) => f()))
    .map((ps) => Promise.all(ps))
    .to(fromAsync)
    .then((arr) => arr.flat());
}

export async function main() {
  console.time();
  const files = await concurrent(3, [
    () => getFile('file1.png'),
    () => getFile('file2.pdf'),
    () => getFile('file3.png'),
    () => getFile('file4.ppt'),
    () => getFile('file5.png'),
    () => getFile('file6.ppt'),
    () => getFile('file7.ppt'),
  ]);
  console.log(files);

  const totalSize = files
    .filter((file) => file.name.endsWith('.png'))
    .map(({ size }) => size)
    .reduce((a, b) => a + b, 0);

  console.log(totalSize);

  // console.log(files.next());
  // console.log(files.next());
  console.timeEnd();
}
