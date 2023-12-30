import { Injectable } from '@nestjs/common';

import { NoMoreCardsLeftE } from '../cards.error';
import { Card } from '../cards.type';

// ---- Command ----
export class DrawCardsCommand {
  constructor(
    public readonly remainingCards: Card[],
    public readonly amount: number = 1,
  ) {}
}

// ---- Result ----
export class DrawnCardsResult {
  drawnCards: Card[];
  remainingCards: Card[];
}

@Injectable()
export class DrawCardsUseCase {
  exec(cmd: DrawCardsCommand): DrawnCardsResult {
    const { amount, remainingCards } = cmd;

    if (!remainingCards || remainingCards.length < amount)
      throw new NoMoreCardsLeftE();

    return {
      drawnCards: remainingCards.slice(-amount),
      remainingCards: remainingCards.slice(-amount),
    };
  }
}
