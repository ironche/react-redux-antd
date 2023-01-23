export function wait(ms: number, ok = true): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      ok ? resolve() : reject();
    }, ms)
  });
}
