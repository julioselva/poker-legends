import { Card, CardRank } from '../cards/cards.type';
import { BetterMap } from '../lib/ts/BetterMap';

export class HandEntity extends Array<Card> {
  findHighestRank(): CardRank {
    return this.reduce((acc, card) => (card.rank.value > acc.value ? card.rank : acc), { kind: 'Two', value: 0 });
  }

  handHasSameSuit(): boolean {
    return this.every((card): boolean => card.suit === this.at(0).suit);
  }

  handHasSequence(): boolean {
    const handHasSequenceRecursive = (remainingHand: Card[], currentCard: Card): boolean => {
      if (remainingHand.length === 0) return true;
      if (remainingHand.at(0).rank.value === currentCard.rank.value + 1)
        return handHasSequenceRecursive(remainingHand.slice(1), remainingHand.at(0));

      return false;
    };

    return handHasSequenceRecursive(this.slice(1), this.at(0));
  }

  handSort(): this {
    return this.sort((a, b) => a.rank.value - b.rank.value);
  }

  private _cachedMappedMatches: BetterMap<string, number> = undefined;
  private _calculateMappedMatches(): BetterMap<string, number> {
    const ranksAndMatchesMap = new BetterMap<string, number>(
      ['Two', 0],
      ['Three', 0],
      ['Four', 0],
      ['Five', 0],
      ['Six', 0],
      ['Seven', 0],
      ['Eight', 0],
      ['Nine', 0],
      ['Ten', 0],
      ['Jack', 0],
      ['Queen', 0],
      ['King', 0],
      ['Ace', 0],
    );

    for (const { rank } of this) {
      ranksAndMatchesMap.set(rank.kind, ranksAndMatchesMap.get(rank.kind) + 1);
    }

    return ranksAndMatchesMap;
  }

  get handMappedMatches(): BetterMap<string, number> {
    if (this._cachedMappedMatches === undefined) {
      this._cachedMappedMatches = this._calculateMappedMatches();
    }

    return this._cachedMappedMatches;
  }
}
