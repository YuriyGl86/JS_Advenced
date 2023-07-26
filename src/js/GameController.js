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
import cursors from './cursors';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.placeTeams();
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
    const char = this.checkEmptyCell(index);
    
    if(char){
      if(['bowman', 'swordsman', 'magician'].includes(char.character.type)){ 
        if (this.gamePlay.activeChar) {
          this.gamePlay.deselectCell(this.gamePlay.activeChar.position);
        }
        this.gamePlay.selectCell(char.position);
        this.gamePlay.activeChar = char;
      } else {
        if(this.gamePlay.activeChar){
          if(this.canAtack(index)){
            this.attack(this.gamePlay.activeChar.character, index)
            this.comp()
          }
        } else {
          GamePlay.showError('It is not your character. Choose your character');
        }
      }

    } else {
      // ветка щелчка по пустой клетке
      if(this.gamePlay.activeChar){
        if (this.canMove(index)){
          this.move(index)
        }
      } else {
        GamePlay.showError('It is not your character. Choose your character')
      }
    }
  
  //   if (char && ['bowman', 'swordsman', 'magician'].includes(char.character.type)) {
  //     if (this.gamePlay.activeChar) {
  //       this.gamePlay.deselectCell(this.gamePlay.activeChar.position);
  //     }
  //     this.gamePlay.selectCell(char.position);
  //     this.gamePlay.activeChar = char;
  //   } else if (!this.gamePlay.activeChar) {
  //     GamePlay.showError('it is not your character. ');
  //   }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    if (this.gamePlay.activeChar
      && this.gamePlay.activeCell
      && this.gamePlay.activeCell !== this.gamePlay.activeChar.position) {
      this.gamePlay.deselectCell(this.gamePlay.activeCell);
    }
    const char = this.checkEmptyCell(index);
    if (char) {
      const msg = this.getTooltipMsg(char);
      this.gamePlay.showCellTooltip(msg, index);
      if (['bowman', 'swordsman', 'magician'].includes(char.character.type)) {
        this.gamePlay.setCursor(cursors.pointer);
      } else if (this.gamePlay.activeChar && this.canAtack(index)) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, 'red');
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    } else if (this.gamePlay.activeChar) {
      if (this.canMove(index)) {
        this.gamePlay.selectCell(index, 'green');
        this.gamePlay.setCursor(cursors.pointer);
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    } else {
      this.gamePlay.setCursor(cursors.auto);
    }
    this.gamePlay.activeCell = index;
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
  }

  getRandomPosition(player) {
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

    playerTeam.forEach((char) => {
      const position = this.getRandomPosition('player')
      const positionedCharacter = new PositionedCharacter(char, position)
      positionedCharacter.moveArray = this.getMoveArray(position, char)
      positionedCharacter.attackArray = this.getAttackArray(position, char)
      this.gamePlay.positionedChars.push(positionedCharacter);
    });
    enemyTeam.forEach((char) => {
      const position = this.getRandomPosition('enemy')
      const positionedCharacter = new PositionedCharacter(char, position)
      positionedCharacter.moveArray = this.getMoveArray(position,char)
      positionedCharacter.attackArray = this.getAttackArray(position, char)
      this.gamePlay.positionedChars.push(positionedCharacter);
    });

    this.gamePlay.redrawPositions(this.gamePlay.positionedChars);
  }

  checkEmptyCell(index) {
    let empt = false;
    this.gamePlay.positionedChars.forEach((PositionedCharacter) => {
      if (PositionedCharacter.position === index) {
        empt = PositionedCharacter;
      }
    });
    return empt;
  }

  getTooltipMsg(PositionedCharacter) {
    const char = PositionedCharacter.character;
    return `\u{1F396} ${char.level} \u{2694} ${char.attack} \u{1F6E1} ${char.defence} \u{2764} ${char.health}`;
  }

  getMoveArray(x, char) {
    const moveArray = [];
    const leftBorder = Math.floor(x / this.gamePlay.boardSize) * this.gamePlay.boardSize;
    const rightBorder = leftBorder + this.gamePlay.boardSize - 1;
    for (let step = 1; step <= char.move; step += 1) {
      moveArray.push(x - step * this.gamePlay.boardSize);
      moveArray.push(x + step * this.gamePlay.boardSize);
      moveArray.push(x + step * (this.gamePlay.boardSize + 1));
      moveArray.push(x - step * (this.gamePlay.boardSize + 1));
      moveArray.push(x + step * (this.gamePlay.boardSize - 1));
      moveArray.push(x - step * (this.gamePlay.boardSize - 1));
      if (x - step >= leftBorder) {moveArray.push(x - step)};
      if (x + step <= rightBorder) {moveArray.push(x + step)};
    };
    
    return moveArray

  }

  getAttackArray(x, char) {
    const attackArray = [];
    const steps = char.attackDist
    const leftBorder = Math.floor(x / this.gamePlay.boardSize) * this.gamePlay.boardSize;
    const rightBorder = leftBorder + this.gamePlay.boardSize - 1;
    const left = Math.max(leftBorder, x - steps)
    const right = Math.min(rightBorder, x + steps)
    
    for(let step = - steps; step <= steps; step +=1){
      const start = left + step*this.gamePlay.boardSize
      const end = right  + step*this.gamePlay.boardSize
      const range = [...Array(end - start + 1).keys()].map(x => x + start)
      attackArray.push(...range)
    }
    return attackArray
  }

  canAtack(index){
    return this.gamePlay.activeChar.attackArray.includes(index)
  }

  canMove(index){
    return this.gamePlay.activeChar.moveArray.includes(index)
  }

  move(index){
    this.gamePlay.deselectCell(index)
    this.gamePlay.deselectCell(this.gamePlay.activeChar.position)

    this.gamePlay.activeChar.position = index
    this.gamePlay.activeChar.moveArray = this.getMoveArray(index, this.gamePlay.activeChar.character)
    this.gamePlay.activeChar.attackArray = this.getAttackArray(index, this.gamePlay.activeChar.character)

    this.gamePlay.activeCell = undefined
    this.gamePlay.activeChar = undefined

    this.gamePlay.redrawPositions(this.gamePlay.positionedChars)
  }

  attack(attacker, index){
    // const attacker = this.gamePlay.activeChar.character
    const target = this.checkEmptyCell(index).character
    const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1)
    this.gamePlay.showDamage(index, damage)
    .then(() => {
      this.gamePlay.deselectCell(index)
      this.gamePlay.deselectCell(this.gamePlay.activeChar.position)
      this.gamePlay.activeCell = undefined
      this.gamePlay.activeChar = undefined
      target.health -= damage
      this.gamePlay.redrawPositions(this.gamePlay.positionedChars)
      
    })
    .then(this.endRound())
    
  }

  comp(){
    const compTeam = this.gamePlay.positionedChars.filter(charPos => !['bowman', 'swordsman', 'magician'].includes(charPos.character.type))
    const userTeam = this.gamePlay.positionedChars.filter(charPos => ['bowman', 'swordsman', 'magician'].includes(charPos.character.type))
    const possibleAttack = []    
    for (let comp of compTeam) {
      for(let user of userTeam){
        if(comp.attackArray.includes(user.position)){
          const damage = Math.max(comp.character.attack - user.character.defence, comp.character.attack * 0.1)
          possibleAttack.push({
            charPos: comp,
            damage: damage,
            index: user.position
          })
          }
        }
      }      
      possibleAttack.sort((a,b) => {b.damage - a.damage})
      if(possibleAttack.length >= 1){
        const attacker = possibleAttack[0].charPos.character
        this.attack(attacker, possibleAttack[0].index)
      }
    
    
  }

  


}
