import { Injectable } from '@nestjs/common';

import { BetterMap } from '../../lib/ts/BetterMap';
import { CardRankingPower, Hand, HandRanking, HighCard } from '../game.type';

// ---- Command ----
export class EvaluateHandRankingCommand {
  constructor(public readonly handsAndRankings: BetterMap<Hand, HandRanking>) {}
}

// ---- Result ----
export class EvaluateHandRankingsResult {
  winnerHand: Hand;
  handRanking: HandRanking;
}

@Injectable()
export class EvaluateHandRankingsUseCase {
  exec(cmd: EvaluateHandRankingCommand) {
    const { handsAndRankings } = cmd;

    const result = this.doRankingEvaluationByCombinations(handsAndRankings);
    const [, handRanking] = result;

    if (handRanking.kind === 'HighCard')
      return this.doRankingEvaluationByTheHighestCard(handsAndRankings as BetterMap<Hand, HighCard>);

    return result;
  }

  private doRankingEvaluationByCombinations(handsAndRankings: BetterMap<Hand, HandRanking>): [Hand, HandRanking] {
    return handsAndRankings.reduce((acc, curr) => {
      const [, accHandRanking] = acc;
      const [, currHandRanking] = curr;

      return accHandRanking.value > currHandRanking.value ? acc : curr;
    });
  }

  private doRankingEvaluationByTheHighestCard(handsAndRankings: BetterMap<Hand, HighCard>): [Hand, HandRanking] {
    return handsAndRankings.reduce((acc, curr) => {
      const [, accHandRanking] = acc;
      const [, currHandRanking] = curr;

      return CardRankingPower[accHandRanking.card.rank] > CardRankingPower[currHandRanking.card.rank] ? acc : curr;
    });
  }
}
