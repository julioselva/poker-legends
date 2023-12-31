import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { CardRanks } from '../../cards/cards.constant';
import { HandEntity } from '../../hand/hand.entity';
import { EmptyHandE } from '../game.error';
import { FourOfAKind, Hand, HandRanking, StraightFlush } from '../game.type';

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
  exec(cmd: EvaluateHandCommand) {
    const { hand } = cmd;

    if (!hand || !hand.length) {
      throw new EmptyHandE();
    }

    const handEntity = new HandEntity();
    handEntity.push(...hand);

    const handRankingCheks = [this.getStraightFlush, this.checkIfFourOfAKind];

    for (const checks of handRankingCheks) {
      const result = checks(handEntity);
      if (result !== null && result !== undefined) {
        return result;
      }
    }

    return null;
  }

  private getStraightFlush(hand: HandEntity): StraightFlush | undefined {
    if (hand.handHasSameSuit() && hand.handSort().handHasSequence())
      return {
        kind: 'StraightFlush',
        suit: hand.at(0).suit,
        highestRank: hand.findHighestRank(),
      };

    return null;
  }

  private checkIfFourOfAKind(hand: HandEntity): FourOfAKind | undefined {
    const mappedMatches = hand.handMappedMatches;
    const [maybeCardRankKind] = mappedMatches.find(([, amount]) => amount === 4);

    if (maybeCardRankKind) {
      const [kicker] = hand.handMappedMatches.find(([cardRankKind]) => cardRankKind != maybeCardRankKind);

      return {
        kind: 'FourOfAKind',
        fourRank: CardRanks.find((cr) => cr.kind === maybeCardRankKind),
        kicker: CardRanks.find((cr) => cr.kind === kicker),
      };
    }

    return null;
  }
}
