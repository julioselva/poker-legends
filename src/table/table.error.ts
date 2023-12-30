// ---- Errors ----
export abstract class TableE extends Error {}

// ---- NotEnoughPlayers ----
export class NotEnoughPlayersE extends TableE {
  public readonly name = NotEnoughPlayersE.name;
  public readonly message = 'The minumum amount of players is 2';
}
