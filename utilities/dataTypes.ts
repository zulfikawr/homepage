export const tuple = <T extends string[]>(...args: T) => args;

// Utility Types
export type StringLiteral<T> = T extends string
  ? string extends T
    ? never
    : T
  : never;
