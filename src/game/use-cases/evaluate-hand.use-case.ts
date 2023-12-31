import { Injectable } from '@nestjs/common';

import { CardRanks } from '../../cards/cards.type';
import { HandEntity } from '../../hand/hand.entity';
import { EmptyHandE } from '../game.error';
import { FourOfAKind, Hand, HandRanking, HighCard, StraightFlush } from '../game.type';

// ---- Command ----
export class EvaluateHandCommand {
  constructor(public readonly hand: Hand) {}
}

// ---- Result ----
export class EvaluateHandResult {
  handRanking: HandRanking;
}

@Injectable()
export class EvaluateHandUseCase {
  exec(cmd: EvaluateHandCommand): [Hand, HandRanking] {
    const { hand } = cmd;

    if (!hand || !hand.length) {
      throw new EmptyHandE();
    }

    const handEntity = new HandEntity();
    handEntity.push(...hand);

    const handRankingCheks = [this.getStraightFlush, this.getFourOfAKind, this.getHighestCard];

    for (const checks of handRankingCheks) {
      const result = checks(handEntity);
      if (result !== null && result !== undefined) {
        return [hand, result];
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

  private getHighestCard(hand: HandEntity): HighCard {
    const { rank, suit } = hand.handSort().at(-1);

    return {
      kind: 'HighCard',
      card: { suit, rank },
      value: 0,
    };
  }
}
