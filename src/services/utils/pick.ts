export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const copy = {} as Pick<T, K>;

  for (let i = 0; i < keys.length; i++) {
    copy[keys[i]] = obj[keys[i]];
  }

  return copy;
}
