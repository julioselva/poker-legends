import { Injectable } from '@nestjs/common';

import { NoMoreCardsLeftE } from '../cards.error';
import { Card } from '../cards.type';

// ---- Command ----
export class DrawCardsCommand {
  constructor(
    public readonly deck: Card[],
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
    const { amount, deck } = cmd;

    if (!deck || deck.length < amount) throw new NoMoreCardsLeftE();

    return {
      drawnCards: deck.splice(-amount),
      remainingCards: deck,
    };
  }
}
