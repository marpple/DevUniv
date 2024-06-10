const test = (a: number) => a;

const res = test(2);

type Test<T extends number> = T extends 2 ? 3 : 4;
// type CC = Test<2>;

type Head<T extends any[]> = T extends [infer A, ...any[]] ? A : undefined;

// type CC1 = Head<[1, 2, 3, 4]>; // 1
// type CC2 = Head<[1]>; // 1
// type CC3 = Head<[]>; // undefined

type Equal<A, B> = A extends B ? (B extends A ? 1 : 0) : 0;

const Pass = 1;
const Fail = 0;
declare function check<A, B>(params: Equal<Equal<A, B>, typeof Pass>): void;

check<1, 2>(Fail);

check<Head<[1, 2, 3, 4]>, 1>(Pass);
check<Head<[1]>, 1>(Pass);
check<Head<[]>, undefined>(Pass);
check<Head<[]>, 2>(Fail);

type Length<T extends any[] | string, P extends any[] = []> = T extends any[]
  ? T["length"]
  : T extends `${T[0]}${infer A}`
  ? Length<A, Append<P, any>>
  : Length<P>;

check<Length<[1, 2, 3]>, 3>(Pass);
check<Length<"abcd">, 4>(Pass);
check<Length<"🙏abcd">, 6>(Pass);

type HasTail<T extends any[]> = Length<T> extends 0 ? false : true;

check<HasTail<[1, 2, 3]>, true>(Pass);
check<HasTail<[3]>, true>(Pass);
check<HasTail<[]>, false>(Pass);

type Tail<T extends any[]> = T extends [any, ...infer A] ? A : [];

check<Tail<[1, 2, 3, 4, 5]>, [2, 3, 4, 5]>(Pass);
check<Tail<[4, 5]>, [5]>(Pass);
check<Tail<[4]>, []>(Pass);
check<Tail<[]>, []>(Pass);

type Last<T extends any[]> = T extends [...any[], infer A] ? A : undefined;
check<Last<[1, 2, 3, 4]>, 4>(Pass);
check<Last<[1]>, 1>(Pass);
check<Last<[]>, undefined>(Pass);
check<Last<[2]>, undefined>(Fail);

type Prepend<T extends any[], E> = [E, ...T];

check<Prepend<[], 1>, [1]>(Pass);
check<Prepend<[3, 4, 5], 2>, [2, 3, 4, 5]>(Pass);

type Drop<N extends number, T extends any[], P extends any[] = []> = {
  0: T;
  1: Drop<N, Tail<T>, Prepend<P, any>>;
}[Length<P> extends N ? 0 : 1];

// const a = {
//   "0": 1 as const,
// }["0"];

check<Drop<3, [1, 2, 3, 4, 5, 6]>, [4, 5, 6]>(Pass);
check<Drop<0, [1, 2, 3, 4, 5, 6]>, [1, 2, 3, 4, 5, 6]>(Pass);
check<Drop<7, [1, 2, 3, 4, 5, 6]>, []>(Pass);
check<Drop<6, [1, 2, 3, 4, 5, 6]>, []>(Pass);

type Reverse<T extends any[], P extends any[] = []> = {
  0: P;
  1: Reverse<Tail<T>, Prepend<P, Head<T>>>;
}[Length<T> extends 0 ? 0 : 1];

check<Reverse<[1, 2, 3, 4, 5, 6]>, [6, 5, 4, 3, 2, 1]>(Pass);

type Concat<A extends any[], B extends any[]> = [...A, ...B];

check<Concat<[1, 2, 3], [4, 5, 6]>, [1, 2, 3, 4, 5, 6]>(Pass);

type Append<A extends any[], B> = Concat<A, [B]>;

check<Append<[1, 2, 3], 4>, [1, 2, 3, 4]>(Pass);

type Join<T extends any[], S extends string> = Length<T> extends 0
  ? ""
  : Length<T> extends 1
  ? `${T[0]}`
  : `${T[0]}${S}${Join<Tail<T>, S>}`;

check<Join<[1, 2, 3, 4, 5], ",">, "1,2,3,4,5">(Pass);
check<Join<[1], ",">, "1">(Pass);
check<Join<[], ",">, "">(Pass);

type Replace<
  T extends string,
  A extends string,
  B extends string
> = T extends `${infer P1}${A}${infer P2}`
  ? Replace<`${P1}${B}${P2}`, A, B>
  : T;

check<Replace<"abcdfdfda", "f", "c">, "abcdcdcda">(Pass);

type Split<
  T extends string,
  S extends string,
  P extends any[] = []
> = T extends `${infer A}${S}${infer B}`
  ? Split<B, S, Append<P, A>>
  : Append<P, T>;

check<Split<"asd,f,fd,dfasd", ",">, ["asd", "f", "fd", "dfasd"]>(Pass);

// [].flat()

// const arr = [1,2,3,4,5][0] // 1
// const arr = [1,2,3,4,5][1] // 2

// const arr = [-1,0,1,2,3,4][2] // 1
// const arr = [-1,0,1,2,3,4][1] // 0

type Flat<T, N extends number = 1> = {
  0: T;
  1: T extends Array<infer A> ? Flat<A, Add<N, -1>> : T;
}[N extends -1 ? 0 : 1];

declare function flat<T extends any[], N extends number = 1>(
  arr: T,
  n?: N
): Flat<T, N>[];

const arr = flat([1, 2, 3]);
const arr2 = flat([1, 2, 3, [4]]);
const arr3 = flat([1, 2, 3, [[4]]], 2);

check<Flat<[1, 2, 3, [4]]>, 1 | 2 | 3 | 4>(Pass);
check<Flat<[1, 2, 3, [[4]]], 1>, 1 | 2 | 3 | [4]>(Pass);
check<Flat<[1, 2, 3, [[4]]], 2>, 1 | 2 | 3 | 4>(Pass);
check<Flat<[1, 2, [3, [4]]], 1>, 1 | 2 | 3 | [4]>(Pass);
check<Flat<[1, 2, [3, [4]]], 2>, 1 | 2 | 3 | 4>(Pass);

type IterationMap = {
  __: [number, "+" | "-" | "0", "__", "__"];
  "-2": [-2, "-", "__", "-1"];
  "-1": [-1, "-", "-2", "0"];
  "0": [0, "0", "-1", "1"];
  "1": [1, "+", "0", "2"];
  "2": [2, "+", "1", "3"];
  "3": [3, "+", "2", "4"];
  "4": [4, "+", "3", "5"];
  "5": [5, "+", "4", "6"];
  "6": [6, "+", "5", "__"];
};

type Iteration = [
  n: number,
  sign: "+" | "-" | "0",
  prev: keyof IterationMap,
  next: keyof IterationMap
];

type Pos<T extends Iteration> = T[0];
type Next<T extends Iteration> = IterationMap[T[3]];
type Prev<T extends Iteration> = IterationMap[T[2]];

type IterationOf<T extends number> = `${T}` extends keyof IterationMap
  ? IterationMap[`${T}`]
  : IterationMap[`__`];

// 0 1 2 3
// 0 1 2
// 2 -> 0 // 2 prev 1 -> 3

// 1, -2
// 0 1
// -2 -1 0

type IsNegative<N extends Iteration> = {
  "-": true;
  "+": false;
  "0": false;
}[N[1]];

type AddNegative<N1 extends Iteration, N2 extends Iteration> = {
  0: Pos<N1>;
  1: AddNegative<Prev<N1>, Next<N2>>;
}[Pos<N2> extends 0 ? 0 : 1];
type AddPositive<N1 extends Iteration, N2 extends Iteration> = {
  0: Pos<N1>;
  1: AddPositive<Next<N1>, Prev<N2>>;
}[Pos<N2> extends 0 ? 0 : 1];

type _Add<
  N1 extends Iteration,
  N2 extends Iteration
> = IsNegative<N2> extends true ? AddNegative<N1, N2> : AddPositive<N1, N2>;

type Add<N1 extends number, N2 extends number> = _Add<
  IterationOf<N1>,
  IterationOf<N2>
>;

check<Add<1, 2>, 3>(Pass);
check<Add<1, -1>, 0>(Pass);
check<Add<1, -2>, -1>(Pass);
check<Add<3, -2>, 1>(Pass);
