import { Injectable } from '@nestjs/common';

import { CardRanks } from '../../cards/cards.type';
import { HandEntity } from '../../hand/hand.entity';
import { EmptyHandE } from '../game.error';
import {
  Flush,
  FourOfAKind,
  FullHouse,
  Hand,
  HandRanking,
  HighCard,
  OnePair,
  Straight,
  StraightFlush,
  ThreeOfAKind,
  TwoPair,
} from '../game.type';

// ---- Command ----
export class EvaluateHandCommand {
  constructor(public readonly hand: Hand) {}
}

// ---- Result ----
export class EvaluateHandResult {
  constructor(
    public readonly hand: Hand,
    public readonly handRanking: HandRanking,
  ) {}
}

@Injectable()
export class EvaluateHandUseCase {
  exec(cmd: EvaluateHandCommand): EvaluateHandResult {
    const { hand } = cmd;

    if (!hand || !hand.length) {
      throw new EmptyHandE();
    }

    const handEntity = new HandEntity();
    handEntity.push(...hand);

    const handRankingCheks = [
      this.getStraightFlush,
      this.getFourOfAKind,
      this.getFullHouse,
      this.getFlush,
      this.getStraight,
      this.getThreeOfAKind,
      this.getTwoPair,
      this.getOnePair,
      this.getHighestCard,
    ];

    for (const checks of handRankingCheks) {
      const result: HandRanking = checks.call(this, handEntity);
      if (result !== null && result !== undefined) {
        return new EvaluateHandResult(hand, result);
      }
    }
  }

  private getStraightFlush(hand: HandEntity): StraightFlush | undefined {
    if (hand.handHasSameSuit() && hand.handSort().handHasSequence())
      return {
        kind: 'StraightFlush',
        suit: hand.at(0).suit,
        highestRank: hand.findHighestRank(),
        value: 8,
      };

    return null;
  }

  private getFourOfAKind(hand: HandEntity): FourOfAKind | undefined {
    const mappedMatches = hand.handMappedMatches;
    const [maybeCardRankKind] = mappedMatches.find(([, amount]) => amount === 4);

    if (maybeCardRankKind) {
      const [kicker] = hand.handMappedMatches.find(([cardRankKind]) => cardRankKind != maybeCardRankKind);

      return {
        kind: 'FourOfAKind',
        fourRank: CardRanks.find((cr) => cr.kind === maybeCardRankKind),
        kicker: CardRanks.find((cr) => cr.kind === kicker),
        value: 7,
      };
    }

    return null;
  }

  private getFullHouse(hand: HandEntity): FullHouse | undefined {
    const threeOfAKind = this.getThreeOfAKind(hand);

    if (threeOfAKind) {
      const onePair = this.getOnePair(hand);

      if (onePair) {
        return {
          kind: 'FullHouse',
          pairRank: onePair.pairRank,
          threeRank: threeOfAKind.threeRank,
          value: 6,
        };
      }
    }

    return null;
  }

  private getFlush(hand: HandEntity): Flush | undefined {
    if (hand.handHasSameSuit())
      return {
        kind: 'Flush',
        suit: hand.at(0).suit,
        cards: hand.sort(),
        value: 5,
      };

    return null;
  }

  private getStraight(hand: HandEntity): Straight | undefined {
    if (hand.handSort().handHasSequence())
      return {
        kind: 'Straight',
        highestRank: hand.findHighestRank(),
        value: 4,
      };
  }

  private getThreeOfAKind(hand: HandEntity): ThreeOfAKind | undefined {
    const mappedMatches = hand.handMappedMatches;

    const [maybeCardRankKind] = mappedMatches.find(([, amount]) => amount === 3);

    if (maybeCardRankKind) {
      const kickers = hand.filter((card) => card.rank.kind !== maybeCardRankKind);

      return {
        kind: 'ThreeOfAKind',
        threeRank: CardRanks.find((cr) => cr.kind === maybeCardRankKind),
        kickers,
        value: 3,
      };
    }

    return null;
  }

  private getTwoPair(hand: HandEntity): TwoPair | undefined {
    const mappedMatches = hand.handMappedMatches;

    const [maybeFirstPair, maybeSecondPair] = mappedMatches.filter(([, amount]) => amount === 2);

    if (maybeFirstPair && maybeSecondPair) {
      const firstRank = CardRanks.find((cr) => cr.kind === maybeFirstPair.at(0));
      const secondRank = CardRanks.find((cr) => cr.kind === maybeSecondPair.at(0));

      const [highPairRank, lowPairRank] =
        firstRank.value > secondRank.value ? [firstRank, secondRank] : [secondRank, firstRank];

      const kicker = hand.find((card) => card.rank.kind !== firstRank.kind && card.rank.kind !== secondRank.kind);

      return {
        kind: 'TwoPair',
        highPairRank,
        lowPairRank,
        kicker,
        value: 2,
      };
    }

    return null;
  }

  private getOnePair(hand: HandEntity): OnePair | undefined {
    const mappedMatches = hand.handMappedMatches;

    const [maybeCardRankKind] = mappedMatches.find(([, amount]) => amount === 2);

    if (maybeCardRankKind) {
      const kickers = hand.filter((card) => card.rank.kind !== maybeCardRankKind);

      return {
        kind: 'OnePair',
        pairRank: CardRanks.find((cr) => cr.kind === maybeCardRankKind),
        kickers,
        value: 1,
      };
    }

    return null;
  }

  private getHighestCard(hand: HandEntity): HighCard {
    const { rank, suit } = hand.handSort().at(-1);

    return {
      kind: 'HighCard',
      card: { suit, rank },
      value: 0,
    };
  }
}
