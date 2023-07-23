import themes from './themes';
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Vampire from './characters/Vampire';
import Undead from './characters/Undead';
import Daemon from './characters/Daemon';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.placeTems();
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }

  getPositionNumber(player) {
    let number;
    while (true) {
      const randomCol = Math.round(Math.random()); // return 0 or 1
      if (player === 'player') {
        const randomRow = Math.floor(Math.random() * this.gamePlay.boardSize); // return random from 0 to boardSize-1
        number = this.gamePlay.boardSize * randomRow + randomCol;
      } else if (player === 'enemy') {
        const randomRow = Math.floor(Math.random() * (this.gamePlay.boardSize)) + 1; // return random from 1 to boardSize
        number = this.gamePlay.boardSize * randomRow - 1 - randomCol;
      } else {
        throw new Error('incorrect type of player');
      }
      if (!this.gamePlay.emtyCell.has(number)) {
        this.gamePlay.emtyCell.add(number);
        return number;
      }
    }
  }

  placeTems() {
    const playerTeam = generateTeam([Bowman, Magician, Swordsman], 1, 4).toArray();
    const enemyTeam = generateTeam([Vampire, Undead, Daemon], 1, 4).toArray();

    const positionedChars = [];
    const cur = this;

    playerTeam.forEach((char) => {
      positionedChars.push(new PositionedCharacter(char, this.getPositionNumber('player')));
    });
    enemyTeam.forEach((char) => {
      positionedChars.push(new PositionedCharacter(char, this.getPositionNumber('enemy')));
    });

    this.gamePlay.redrawPositions(positionedChars);
  }
}
