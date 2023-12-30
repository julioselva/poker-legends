import { Injectable } from '@nestjs/common';

import { Card } from '../../cards/cards.type';
import {
  DrawCardsCommand,
  DrawCardsUseCase,
} from '../../cards/use-cases/draw-cards.use-case.';
import { GenerateDeckUseCase } from '../../cards/use-cases/generate-deck.use-case.';
import { Hand } from '../../game/game.type';
import { NotEnoughPlayersE, TooManyPlayersE } from '../table.error';

// ---- Command ----
export class CreateTableCommand {
  constructor(public readonly tableOf: number) {}
}

export class CreateTableResult {
  constructor(
    public readonly hands: Hand[],
    public readonly remainingCards: Card[],
  ) {}
}

@Injectable()
export class CreateTableUseCase {
  constructor(
    private readonly generateDeck: GenerateDeckUseCase,
    private readonly drawCards: DrawCardsUseCase,
  ) {}
  exec(cmd: CreateTableCommand): CreateTableResult {
    const { tableOf } = cmd;

    if (tableOf < 2) throw new NotEnoughPlayersE();
    if (tableOf > 5) throw new TooManyPlayersE();

    const generatedDeck = this.generateDeck.exec();
    return this.dealCards(generatedDeck, tableOf);
  }

  private dealCards(deck: Card[], tableOf: number) {
    const dealCardsRecursive = (
      remainingHands: number,
      remainingCards: Card[],
      hands: Hand[],
    ): { hands: Hand[]; remainingCards: Card[] } => {
      if (remainingHands === 0) return { hands, remainingCards };

      const currentHand = this.drawCards.exec(
        new DrawCardsCommand(remainingCards, 5),
      );

      return dealCardsRecursive(
        remainingHands - 1,
        currentHand.remainingCards,
        hands.concat(currentHand.drawnCards),
      );
    };

    const { drawnCards, remainingCards } = this.drawCards.exec(
      new DrawCardsCommand(deck, 5),
    );

    return dealCardsRecursive(tableOf - 1, remainingCards, [drawnCards]);
  }
}
