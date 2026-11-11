declare module 'bun:test' {
  export const describe: (name: string, fn: () => void) => void;
  export const it: (name: string, fn: () => void | Promise<void>) => void;
  export const beforeAll: (fn: () => void | Promise<void>) => void;
  export const afterAll: (fn: () => void | Promise<void>) => void;
  export const expect: any;
  export const mock: {
    module: (specifier: string, factory: () => unknown) => void;
  };
}
