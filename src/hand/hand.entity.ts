import { Card, CardRank } from '../cards/cards.type';
import { BetterMap } from '../lib/ts/BetterMap';

export class HandEntity extends Array<Card> {
  findHighestRank(): CardRank {
    return this.reduce(
      (acc, card) => (card.rank.value > acc.value ? card.rank : acc),
      { kind: 'Two', value: 0 },
    );
  }

  handHasSameRank(): boolean {
    return this.every((card): boolean => card.suit === this.at(0).suit);
  }

  handHasSequence(): boolean {
    const handHasSequenceRecursive = (
      remaningHand: Card[],
      currentCard: Card,
    ): boolean => {
      if (remaningHand.length === 0) return true;
      if (remaningHand.at(0).rank.value === currentCard.rank.value - 1)
        return handHasSequenceRecursive(
          remaningHand.slice(1),
          remaningHand.at(0),
        );

      return false;
    };

    return handHasSequenceRecursive(this.slice(1), this.at(0));
  }

  handSort(): this {
    return this.sort((a, b) => a.rank.value - b.rank.value);
  }

  private _cachedMappedMatches: BetterMap<CardRank, number> = undefined;
  private _calculateMappedMatches(): BetterMap<CardRank, number> {
    const ranksAndMatchesMap = new BetterMap<CardRank, number>([
      ['Ace', 0],
      ['2', 0],
      ['3', 0],
      ['4', 0],
      ['5', 0],
      ['6', 0],
      ['7', 0],
      ['8', 0],
      ['9', 0],
      ['10', 0],
      ['Jack', 0],
      ['Queen', 0],
      ['King', 0],
    ]);

    for (const { rank } of this) {
      ranksAndMatchesMap.set(rank, ranksAndMatchesMap.get(rank) + 1);
    }

    return ranksAndMatchesMap;
  }

  get handMappedMatches(): BetterMap<CardRank, number> {
    if (this._cachedMappedMatches === undefined) {
      this._cachedMappedMatches = this._calculateMappedMatches();
    }

    return this._cachedMappedMatches;
  }
}
