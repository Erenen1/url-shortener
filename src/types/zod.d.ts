declare module 'zod' {
  export class ZodType<T> {
    parse(data: unknown): T;
    safeParse(data: unknown): { success: boolean; data?: T; error?: any };
    optional(): ZodType<T | undefined>;
    nullable(): ZodType<T | null>;
    transform<U>(transformer: (arg: T) => U): ZodType<U>;
    static infer<T extends ZodType<any>>(schema: T): T extends ZodType<infer U> ? U : never;
  }

  export interface ZodStringDef {
    transform<U>(transformer: (arg: string) => U): ZodType<U>;
  }

  export const z: {
    string(): ZodType<string> & ZodStringDef;
    number(): ZodType<number>;
    boolean(): ZodType<boolean>;
    date(): ZodType<Date>;
    enum<T extends string[]>(values: T): ZodType<T[number]>;
    object<T extends Record<string, ZodType<any>>>(shape: T): ZodType<{
      [K in keyof T]: T[K] extends ZodType<infer U> ? U : never;
    }>;
    infer<T extends ZodType<any>>(schema: T): T extends ZodType<infer U> ? U : never;
  };
} 