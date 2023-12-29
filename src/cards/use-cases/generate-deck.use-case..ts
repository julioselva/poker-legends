import { Injectable } from '@nestjs/common';

import { CardRanks, CardSuits } from '../card.constant';
import { Card } from '../cards.type';

@Injectable()
export class GenerateDeck {
  private generateDeck() {
    const deck: Card[] = [];

    for (const suit of CardSuits) {
      for (const rank of CardRanks) {
        deck.push({ suit, rank });
      }
    }

    return deck;
  }

  private shuffleDeck(deck: Card[]) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
  }

  exec(): Card[] {
    return this.shuffleDeck(this.generateDeck());
  }
}
