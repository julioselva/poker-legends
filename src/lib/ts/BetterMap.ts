export class BetterMap<K, V> extends Map<K, V> {
  constructor(...args: [K, V][]) {
    super(args);
  }

  find(predicate: (entry: [K, V]) => boolean) {
    const entries = Array.from(this.entries());

    const findRecursive = (remainingEntries: [K, V][]): [K, V] => {
      if (!remainingEntries.length) return [null, null];
      if (predicate(remainingEntries.at(0))) return remainingEntries.at(0);
      return findRecursive(remainingEntries.slice(1));
    };

    return findRecursive(entries);
  }

  reduce(callbackfn: (accumalator: [K, V], currentValue: [K, V]) => [K, V]): [K, V] {
    const entries = Array.from(this.entries());

    const reduceRecursive = (remainingEntries: [K, V][], acc: [K, V]): [K, V] => {
      if (!remainingEntries.length) return acc;
      return reduceRecursive(remainingEntries.slice(1), callbackfn(acc, remainingEntries.at(0)));
    };

    if (entries.length) return reduceRecursive(entries, entries.at(0));
    return [null, null];
  }
}
