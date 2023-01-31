import { message } from "tdesign-react";

export async function tryCatchFinally<T, E>(
  tryFn: () => T | Promise<T>,
  finallyFn?: () => void,
  catchFn?: (errMsg: string, rawErr: E) => void
): Promise<T | undefined> {
  try {
    const res = tryFn();
    if (res instanceof Promise) {
      return await res;
    }
    return res;
  } catch (e) {
    const errMsg =
      (e as Error).message || (typeof e === "string" && e) || "未知的错误";
    if (catchFn) {
      catchFn(errMsg, e as any);
    } else {
      message.error(errMsg);
    }
  } finally {
    finallyFn?.();
  }
}
