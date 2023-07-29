export default class GameState {
  constructor() {
    this.userTurn = true;
    this.emtyCell = new Set();
    this.activeChar;
    this.activeCell;
    this.positionedChars = []
    this.level = 0
  }

  static from(object) {
    // TODO: create object
    return null;
  }
}
