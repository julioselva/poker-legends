// ---- Errors ----
export abstract class CardsE extends Error {}

// ---- NoMoreCardsLeftE ----
export class NoMoreCardsLeftE extends CardsE {
  public readonly name = NoMoreCardsLeftE.name;
  public readonly message = 'There are no more cards in the deck';
}

// ---- DiscardCardsThresholdOverflowE ----
export class DiscardCardsThresholdOverflowE extends CardsE {
  public readonly name = DiscardCardsThresholdOverflowE.name;
  public readonly message =
    'The maximum cards allowed to be discarded is three';
}
