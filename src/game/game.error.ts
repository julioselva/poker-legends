// ---- Errors ----
export abstract class GameE extends Error {}

// ---- NoMoreCardsLeftE ----
export class EmptyHandE extends GameE {
  public readonly name = EmptyHandE.name;
  public readonly message = 'The hand is empty';
}
