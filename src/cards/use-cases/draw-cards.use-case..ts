import { Injectable } from '@nestjs/common';

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
  drawnCard: Card;
  remaningCards: Card[];
}

// ---- Errors ----
export abstract class CardsE extends Error {}

// ---- NoMoreCardsLeftE ----
export class NoMoreCardsLeftE extends CardsE {
  public readonly name = NoMoreCardsLeftE.name;
  public readonly message = 'There are no more cards in the deck';
}

@Injectable()
export class DrawCards {
  exec(cmd: DrawCardsCommand): DrawnCardsResult {
    const { amount, remainingCards } = cmd;

    if (!remainingCards || remainingCards.length < amount) {
      throw new NoMoreCardsLeftE();
    }

    return {
      drawnCard: remainingCards.at(-amount),
      remaningCards: remainingCards.slice(-amount),
    };
  }
}
