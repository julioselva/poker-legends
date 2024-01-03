import { Card, CardRank, CardRanks, CardSuit, CardSuits } from '../../cards/cards.type';
import { HandEntity } from '../../hand/hand.entity';
import { Hand } from '../game.type';
import { EvaluateHandCommand, EvaluateHandUseCase } from './evaluate-hand.use-case';
import spyOn = jest.spyOn;

describe('EvaluateHandUseCase', () => {
  let evaluateHandUseCase: EvaluateHandUseCase;

  beforeEach(() => {
    evaluateHandUseCase = new EvaluateHandUseCase();
  });

  it('should be defined', () => {
    expect(evaluateHandUseCase).toBeDefined();
  });

  describe('getStraightFlush', () => {
    it.each(new Array(10).fill(null))('should succeed', () => {
      const hand = generateStraightFlush();
      const { handRanking } = evaluateHandUseCase.exec(new EvaluateHandCommand(hand));

      expect(handRanking).toHaveProperty('kind');
      expect(handRanking['kind']).toBe('StraightFlush');
    });
  });

  describe('getFourOfAKind', () => {
    it.each(new Array(10).fill(null))('should succeed', () => {
      const hand = generateFourOfAKind();
      const { handRanking } = evaluateHandUseCase.exec(new EvaluateHandCommand(hand));

      expect(handRanking).toHaveProperty('kind');
      expect(handRanking['kind']).toBe('FourOfAKind');
    });
  });

  describe('getFullHouse', () => {
    it.each(new Array(10).fill(null))('should succeed', () => {
      const hand = generateFullHouse();
      const { handRanking } = evaluateHandUseCase.exec(new EvaluateHandCommand(hand));

      expect(handRanking).toHaveProperty('kind');
      expect(handRanking['kind']).toBe('FullHouse');
    });
  });

  describe('getFlush', () => {
    it.each(new Array(10).fill(null))('should succeed', () => {
      const hand = generateFlush();
      const { handRanking } = evaluateHandUseCase.exec(new EvaluateHandCommand(hand));

      expect(handRanking).toHaveProperty('kind');
      expect(handRanking['kind']).toBe('Flush');
    });
  });

  describe('getStraight', () => {
    it.each(new Array(10).fill(null))('should succeed', () => {
      const hand = generateStraight();
      const { handRanking } = evaluateHandUseCase.exec(new EvaluateHandCommand(hand));

      expect(handRanking).toHaveProperty('kind');
      expect(handRanking['kind']).toBe('Straight');
    });
  });

  describe('getThreeOfAKind', () => {
    it.each(new Array(10).fill(null))('should succeed', () => {
      const hand = generateThreeOfAKind();
      const { handRanking } = evaluateHandUseCase.exec(new EvaluateHandCommand(hand));

      expect(handRanking).toHaveProperty('kind');
      expect(handRanking['kind']).toBe('ThreeOfAKind');
    });
  });

  describe('getTwoPair', () => {
    it.each(new Array(10).fill(null))('should succeed', () => {
      const hand = generateTwoPair();
      const { handRanking } = evaluateHandUseCase.exec(new EvaluateHandCommand(hand));

      expect(handRanking).toHaveProperty('kind');
      expect(handRanking['kind']).toBe('TwoPair');
    });
  });

  describe('getOnePair', () => {
    it.each(new Array(10).fill(null))('should succeed', () => {
      const hand = generateOnePair();
      const { handRanking } = evaluateHandUseCase.exec(new EvaluateHandCommand(hand));

      expect(handRanking).toHaveProperty('kind');
      expect(handRanking['kind']).toBe('OnePair');
    });
  });

  describe('getHighCard', () => {
    it.each(new Array(10).fill(null))('should succeed', () => {
      const hand = generateHighCard();
      const { handRanking } = evaluateHandUseCase.exec(new EvaluateHandCommand(hand));

      expect(handRanking).toHaveProperty('kind');
      expect(handRanking['kind']).toBe('HighCard');
    });
  });
});

function shuffleHand<T>(hand: T[]): T[] {
  const shuffledHand = [...hand];

  for (let i = shuffledHand.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffledHand[i], shuffledHand[randomIndex]] = [shuffledHand[randomIndex], shuffledHand[i]];
  }

  return shuffledHand;
}

function generateRandomCard(
  skipTheseCards: Card[] = [],
  skipTheseRanks: CardRank[] = [],
  skipTheseSuits: CardSuit[] = [],
  includeThisRank: CardRank[] = [],
  includeThisSuit: CardSuit[] = [],
  sentDeck?: Card[],
): Card {
  let deck: Card[];
  if (sentDeck) deck = sentDeck;
  else deck = generateDeck();

  let filteredDeck: Card[] = shuffleHand(deck);

  if (includeThisRank.length)
    filteredDeck = filteredDeck.filter((card) => includeThisRank.some((cr) => cr.value === card.rank.value));

  if (includeThisSuit.length)
    filteredDeck = filteredDeck.filter((card) => includeThisSuit.some((cs) => cs === card.suit));

  filteredDeck = filteredDeck
    .filter((card) => !skipTheseCards.some((sc) => sc.rank.value === card.rank.value && card.suit === sc.suit))
    .filter((card) => !skipTheseRanks.some((cr) => cr.value === card.rank.value))
    .filter((card) => !skipTheseSuits.some((cs) => cs === card.suit));

  return filteredDeck.at(-1);
}

function generateDeck(): Card[] {
  const deck: Card[] = [];

  for (const suit of CardSuits) {
    for (const rank of CardRanks) {
      deck.push({ suit, rank });
    }
  }

  return deck;
}

function generateStraightFlush(): Hand {
  const seedSuit: CardSuit = CardSuits[Math.floor(Math.random() * 4)];
  const seedRank: CardRank = CardRanks[Math.floor(Math.random() * 9)];

  const first: Card = { suit: seedSuit, rank: seedRank };
  const second: Card = { suit: seedSuit, rank: CardRanks.find((cr) => cr.value === seedRank.value + 1) };
  const third: Card = { suit: seedSuit, rank: CardRanks.find((cr) => cr.value === seedRank.value + 2) };
  const fourth: Card = { suit: seedSuit, rank: CardRanks.find((cr) => cr.value === seedRank.value + 3) };
  const fifth: Card = { suit: seedSuit, rank: CardRanks.find((cr) => cr.value === seedRank.value + 4) };

  return shuffleHand([first, second, third, fourth, fifth]);
}

function generateFourOfAKind(): Hand {
  const seedRank: CardRank = CardRanks[Math.floor(Math.random() * 13)];

  const first: Card = { suit: CardSuits[0], rank: seedRank };
  const second: Card = { suit: CardSuits[1], rank: seedRank };
  const third: Card = { suit: CardSuits[2], rank: seedRank };
  const fourth: Card = { suit: CardSuits[3], rank: seedRank };
  const fifth: Card = generateRandomCard([first, second, third, fourth]);

  return shuffleHand([first, second, third, fourth, fifth]);
}

function generateFullHouse(): Hand {
  const pairRank: CardRank = CardRanks[Math.floor(Math.random() * 13)];
  const fistPairSuit: CardSuit = CardSuits[Math.floor(Math.random() * 4)];
  const secondPairSuit: CardSuit = CardSuits.filter((cs) => cs !== fistPairSuit)[Math.random() * 3];

  const threeRank: CardRank = CardRanks.filter((cr) => cr.value !== pairRank.value)[Math.floor(Math.random() * 12)];
  const firstThreeSuit: CardSuit = CardSuits[Math.floor(Math.random() * 4)];
  const secondThreeSuit: CardSuit = CardSuits.filter((cs) => cs !== firstThreeSuit)[Math.random() * 3];
  const thirdThreeSuit: CardSuit = CardSuits.filter((cs) => cs !== firstThreeSuit && cs !== secondThreeSuit)[
    Math.random() * 2
  ];

  const first: Card = { suit: fistPairSuit, rank: pairRank };
  const second: Card = { suit: secondPairSuit, rank: pairRank };
  const third: Card = { suit: firstThreeSuit, rank: threeRank };
  const fourth: Card = { suit: secondThreeSuit, rank: threeRank };
  const fifth: Card = { suit: thirdThreeSuit, rank: threeRank };

  return shuffleHand([first, second, third, fourth, fifth]);
}

function generateFlush(): Hand {
  const hand = new HandEntity();

  do {
    hand.length = 0;
    const seedSuit: CardSuit = CardSuits[Math.floor(Math.random() * 4)];
    const allSuitCards: Card[] = [];

    for (const rank of CardRanks) {
      allSuitCards.push({ suit: seedSuit, rank });
    }

    const shuffledHand = shuffleHand(allSuitCards);

    hand.push(...shuffledHand.slice(-5));
  } while (hand.handSort().handHasSequence());

  return shuffleHand(hand);
}

function generateStraight(): Hand {
  const seedRank: CardRank = CardRanks[Math.floor(Math.random() * 9)];

  const firstSuit: CardSuit = CardSuits[Math.floor(Math.random() * 4)];
  const secondSuit: CardSuit = CardSuits[Math.floor(Math.random() * 4)];
  const thirdSuit: CardSuit = CardSuits[Math.floor(Math.random() * 4)];
  const fourthAndFifthSuit = CardSuits.filter((cs) => cs !== firstSuit && cs !== secondSuit && cs !== thirdSuit)[
    Math.floor(0)
  ];

  const first: Card = { suit: firstSuit, rank: seedRank };
  const second: Card = { suit: secondSuit, rank: CardRanks.find((cr) => cr.value === seedRank.value + 1) };
  const third: Card = { suit: thirdSuit, rank: CardRanks.find((cr) => cr.value === seedRank.value + 2) };
  const fourth: Card = { suit: fourthAndFifthSuit, rank: CardRanks.find((cr) => cr.value === seedRank.value + 3) };
  const fifth: Card = { suit: fourthAndFifthSuit, rank: CardRanks.find((cr) => cr.value === seedRank.value + 4) };

  return shuffleHand([first, second, third, fourth, fifth]);
}

function generateThreeOfAKind() {
  const seedRank: CardRank = CardRanks[Math.floor(Math.random() * 13)];
  const firstSuit: CardSuit = CardSuits[Math.floor(Math.random() * 4)];
  const secondSuit: CardSuit = CardSuits.filter((cs) => cs !== firstSuit)[Math.random() * 3];
  const thirdSuit: CardSuit = CardSuits.filter((cs) => cs !== firstSuit && cs !== secondSuit)[Math.random() * 2];
  const fourthSuit: CardSuit = CardSuits.find((cs) => cs !== firstSuit && cs !== secondSuit && cs !== thirdSuit);

  const first: Card = { suit: firstSuit, rank: seedRank };
  const second: Card = { suit: secondSuit, rank: seedRank };
  const third: Card = { suit: thirdSuit, rank: seedRank };
  const fourth: Card = generateRandomCard([first, second, third], [seedRank], [fourthSuit]);
  const fifth: Card = generateRandomCard([first, second, third, fourth], [seedRank, fourth.rank], [fourthSuit]);

  return shuffleHand([first, second, third, fourth, fifth]);
}

function generateTwoPair(): Card[] {
  const first: Card = generateRandomCard();
  const second: Card = generateRandomCard([first], [], [], [first.rank]);
  const third: Card = generateRandomCard([first, second], [first.rank]);
  const fourth: Card = generateRandomCard([first, second, third], [first.rank], [], [third.rank]);
  const fifth: Card = generateRandomCard([first, second, third, fourth], [first.rank, third.rank]);

  return shuffleHand([first, second, third, fourth, fifth]);
}

function generateOnePair(): Card[] {
  const first: Card = generateRandomCard();
  const second: Card = generateRandomCard([first], [], [], [first.rank]);
  const third: Card = generateRandomCard([first, second], [first.rank]);
  const fourth: Card = generateRandomCard([first, second, third], [first.rank, third.rank]);
  const fifth: Card = generateRandomCard([first, second, third, fourth], [first.rank, third.rank, fourth.rank]);

  return shuffleHand([first, second, third, fourth, fifth]);
}

function generateHighCard(): Card[] {
  const first: Card = generateRandomCard();
  const second: Card = generateRandomCard([first], [first.rank], [first.suit]);
  const third: Card = generateRandomCard([first, second], [first.rank, second.rank], [first.suit]);
  const fourth: Card = generateRandomCard([first, second, third], [first.rank, second.rank, third.rank], [first.suit]);
  const fifth: Card = generateRandomCard(
    [first, second, third, fourth],
    [first.rank, second.rank, third.rank, fourth.rank],
    [first.suit],
  );

  return shuffleHand([first, second, third, fourth, fifth]);
}
