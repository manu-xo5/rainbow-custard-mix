// @ts-ignore
export const bind = (fn) => (x) => x ? fn(x) : null

// @ts-ignore
export const tryCatch = <T>(promise: (x: T) => any) => async (x: T) => {
  try {
    return await promise(x)
  } catch (err) {
    return null
  }
}

interface Pipe {
  <A>(value: A): Promise<A>
  <A, B>(value: A, fn1: (input: A) => B): Promise<B>
  <A, B, C>(value: A, fn1: (input: A) => B, fn2: (input: B) => C): Promise<C>
  <A, B, C, D>(value: A, fn1: (input: A) => B, fn2: (input: B) => C, fn3: (input: C) => D): Promise<D>
  <A, B, C, D, E>(value: A, fn1: (input: A) => B, fn2: (input: B) => C, fn3: (input: C) => D, fn4: (input: D) => E): Promise<E>
}
export const pipe: Pipe = (a: any, ...fns: ((arg: any) => any)[]) => {
  return fns.reduce((value, fn) => value.then(fn), Promise.resolve(a))
}
