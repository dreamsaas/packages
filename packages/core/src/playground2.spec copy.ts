type tuple = ['a', number, string[]]

const fn00 = (name: string, age: number, single: boolean) => true
type test07 = Parameters<typeof fn00>

type Params<F extends (...args: any[]) => any> = F extends (
	...args: infer A
) => any
	? A
	: never

// takes first item
type Head<T extends any[]> = T extends [any, ...any[]] ? T[0] : never

type test09 = Head<[1, 2, string, number]>
type test10 = Head<Parameters<typeof fn00>>

// get everything that head doesn't and return
type Tail<T extends any[]> = ((...t: T) => any) extends (
	_: any,
	...tail: infer TT
) => any
	? TT
	: []

type test11 = Tail<[1, 2, string, number]>
type test12 = Tail<Parameters<typeof fn00>>
type test13 = Tail<test12>

type HasTail<T extends any[]> = T extends [] | [any] ? false : true

type ObjectInfer<O> = O extends { a: infer A } ? A : never

type FunctionInfer<F> = F extends (...args: infer A) => infer R ? [A, R] : never

type ClassInfer<I> = I extends Promise<infer G> ? G : never

type ArrayInfer<T> = T extends (infer U)[] ? U : never

type TupleInfer<T> = T extends [infer A, ...(infer B)[]] ? [A, B] : never

const toCurry01 = (name: string, age: number, single: boolean) => true
const curried01 = (namme: string) => (age: number) => (single: boolean) => true

// cant do rest parameters
type CurryV0<P extends any[], R> = (
	arg0: Head<P>
) => HasTail<P> extends true ? CurryV0<Tail<P>, R> : R

// forget what was wrong with this
type CurryV1<P extends any[], R> = (
	arg0: Head<P>,
	...rest: Tail<Partial<P>>
) => HasTail<P> extends true ? CurryV1<Tail<P>, R> : R

// doesn't do type checking because of any[]
type CurryV2<P extends any[], R> = <T extends any[]>(
	args: T
) => HasTail<P> extends true ? CurryV2<Tail<T>, R> : R

type Last<T extends any[]> = { 0: Last<Tail<T>>; 1: Head<T> }[HasTail<
	T
> extends true
	? 0
	: 1]

type Length<T extends any[]> = T['length']

type Prepend<E, T extends any[]> = ((head: E, ...args: T) => any) extends (
	...args: infer U
) => any
	? U
	: T

type Drop<N extends number, T extends any[], I extends any[] = []> = {
	0: Drop<N, Tail<T>, Prepend<any, I>>
	1: T
}[Length<I> extends N ? 1 : 0]

describe('testing3', () => {
	it('should', async () => {})
})
