// ---- Errors ----
export abstract class TableE extends Error {}

// ---- NotEnoughPlayersE ----
export class NotEnoughPlayersE extends TableE {
  public readonly name = NotEnoughPlayersE.name;
  public readonly message = 'The minumum amount of players is 2';
}

// ---- TooManyPlayersE ----
export class TooManyPlayersE extends TableE {
  public readonly name = TooManyPlayersE.name;
  public readonly message = 'The maximum amount of players is 5';
}
