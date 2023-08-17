export default class GameState {
  constructor() {
    this.userTurn = true;
    this.gameOver = false;
    this.emtyCell = new Set();
    this.activeChar = undefined;
    this.activeCell = undefined;
    this.positionedChars = [];
    this.level = 0;
    this.score = 0;
    this.maxScore = 0;
  }

  from(object) {
    // TODO: create object
    this.userTurn = object.userTurn;
    this.emtyCell = object.emtyCell;
    this.activeChar = object.activeChar;
    this.activeCell = object.activeCell;
    this.positionedChars = object.positionedChars;
    this.level = object.level;
    this.gameOver = object.gameOver;
    this.score = object.score;
    this.maxScore = object.maxScore;
    return null;
  }
}
