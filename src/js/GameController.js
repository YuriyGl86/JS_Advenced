import themes from './themes';
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Vampire from './characters/Vampire';
import Undead from './characters/Undead';
import Daemon from './characters/Daemon';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import GamePlay from './GamePlay';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.placeTeams();
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this))
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this))
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this))
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
    const char = this.checkEmptyCell(index)
    
    if(char && ['bowman','swordsman','magician'].includes(char.character.type)){
      console.log('position', char.position)
      if(this.gamePlay.activeCell){
        this.gamePlay.deselectCell(this.gamePlay.activeCell)
      }      
      this.gamePlay.selectCell(char.position)
      this.gamePlay.activeCell = char.position
    } else {
      GamePlay.showError('it is not your character')
    }

  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const char = this.checkEmptyCell(index)
    if(char){
      const msg = this.getTooltipMsg(char)
      this.gamePlay.showCellTooltip(msg, index)
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index)
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

  placeTeams() {
    const playerTeam = generateTeam([Bowman, Magician, Swordsman], 1, 4).toArray();
    const enemyTeam = generateTeam([Vampire, Undead, Daemon], 1, 4).toArray();

    this.gamePlay.positionedChars = [];

    playerTeam.forEach((char) => {
      this.gamePlay.positionedChars.push(new PositionedCharacter(char, this.getPositionNumber('player')));
    });
    enemyTeam.forEach((char) => {
      this.gamePlay.positionedChars.push(new PositionedCharacter(char, this.getPositionNumber('enemy')));
    });

    this.gamePlay.redrawPositions(this.gamePlay.positionedChars);
  }

  checkEmptyCell(index){
    let empt = false
    this.gamePlay.positionedChars.forEach((PositionedCharacter) => {
      if(PositionedCharacter.position === index){
        empt = PositionedCharacter
      }
    })
    return empt
  }

  getTooltipMsg(PositionedCharacter){
    const char = PositionedCharacter.character
    return `\u{1F396} ${char.level} \u{2694} ${char.attack} \u{1F6E1} ${char.defence} \u{2764} ${char.health}`
  }
}
