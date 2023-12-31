export class BetterMap<K, V> extends Map<K, V> {
  constructor(...args) {
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
}
