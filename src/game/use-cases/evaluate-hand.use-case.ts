import { Injectable } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';

import { CardRank, CardSuit } from '../../cards/cards.type';
import { HandEntity } from '../../hand/hand.entity';
import { BetterMap } from '../../lib/ts/BetterMap';
import { FourOfAKind, Hand, HandRanking, StraightFlush } from '../game.type';

// ---- Command ----
export class EvaluateHandCommand {
  hand: Hand;
}

// ---- Result ----
export class EvaluateHandResult {
  handRanking: HandRanking;
}

// ---- Errors ----
export abstract class GameE extends Error {}

// ---- NoMoreCardsLeftE ----
export class EmptyHandE extends GameE {
  public readonly name = EmptyHandE.name;
  public readonly message = 'The hand is empty';
}

@Injectable()
export class EvaluateHandUseCase {
  exec(cmd: EvaluateHandCommand) {
    const { hand } = cmd;

    if (!hand || hand.length) {
      throw new EmptyHandE();
    }

    const handEntity = plainToInstance<HandEntity, Hand>(HandEntity, hand);
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
    if (hand.handHasSameRank() && hand.handSort().handHasSequence())
      return {
        kind: 'StraightFlush',
        suit: hand.at(0).suit,
        highestRank: hand.findHighestRank(),
      };

    return null;
  }

  private checkIfFourOfAKind(hand: HandEntity): FourOfAKind | undefined {
    const [maybeCardRank] = hand.handMappedMatches.find(
      ([, amount]) => amount === 4,
    );

    if (maybeCardRank) {
      const [kicker] = hand.handMappedMatches.find(
        ([cardRank]) => cardRank != maybeCardRank,
      );

      return {
        kind: 'FourOfAKind',
        fourRank: maybeCardRank,
        kicker,
      };
    }
  }
}
