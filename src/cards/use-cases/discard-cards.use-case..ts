import { Injectable } from '@nestjs/common';

import { DiscardCardsThresholdOverflowE, NoMoreCardsLeftE } from '../cards.error';
import { Card } from '../cards.type';
import { DrawCardsCommand, DrawCardsUseCase } from './draw-cards.use-case.';

// ---- Command ----
export class DiscardCardsCommand {
  constructor(
    public readonly remainingCards: Card[],
    public readonly discardedCards: Card[],
  ) {}
}

// ---- Result ----
export class DiscardCardsResult {
  drawnCards: Card[];
  remainingCards: Card[];
}

@Injectable()
export class DiscardCardsUseCase {
  constructor(private readonly drawCards: DrawCardsUseCase) {}

  exec(cmd: DiscardCardsCommand): DiscardCardsResult {
    const { discardedCards, remainingCards } = cmd;

    if (discardedCards.length > 3) throw new DiscardCardsThresholdOverflowE();
    if (!remainingCards || remainingCards.length < discardedCards.length) throw new NoMoreCardsLeftE();

    return this.drawCards.exec(new DrawCardsCommand(remainingCards, discardedCards.length));
  }
}
