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
import GameState from './GameState';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState()
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.placeTeams();
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this))
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this))

    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this))

    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
    const char = this.checkEmptyCell(index);
    
    if(char){
      if(['bowman', 'swordsman', 'magician'].includes(char.character.type)){ 
        if (this.gameState.activeChar) {
          this.gamePlay.deselectCell(this.gameState.activeChar.position);
        }
        this.gamePlay.selectCell(char.position);
        this.gameState.activeChar = char;
      } else {
        if(this.gameState.activeChar){
          if(this.canAtack(index)){
            this.attack(this.gameState.activeChar.character, index)
            
          }
        } else {
          GamePlay.showError('It is not your character. Choose your character');
        }
      }

    } else {
      // ветка щелчка по пустой клетке
      if(this.gameState.activeChar){
        if (this.canMove(index)){
          this.move(index, this.gameState.activeChar)
        }
      } else {
        GamePlay.showError('It is not your character. Choose your character')
      }
    }
  
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    if (this.gameState.activeChar
      && this.gameState.activeCell
      && this.gameState.activeCell !== this.gameState.activeChar.position) {
      this.gamePlay.deselectCell(this.gameState.activeCell);
    }
    const char = this.checkEmptyCell(index);
    if (char) {
      const msg = this.getTooltipMsg(char);
      this.gamePlay.showCellTooltip(msg, index);
      if (['bowman', 'swordsman', 'magician'].includes(char.character.type)) {
        this.gamePlay.setCursor(cursors.pointer);
      } else if (this.gameState.activeChar && this.canAtack(index)) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, 'red');
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    } else if (this.gameState.activeChar) {
      if (this.canMove(index)) {
        this.gamePlay.selectCell(index, 'green');
        this.gamePlay.setCursor(cursors.pointer);
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    } else {
      this.gamePlay.setCursor(cursors.auto);
    }
    this.gameState.activeCell = index;
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
      if (!this.gameState.emtyCell.has(number)) {
        this.gameState.emtyCell.add(number);
        return number;
      }
    }
  }

  placeTeams() {
    const playerTeam = generateTeam([Bowman, Magician, Swordsman], 1, 4).toArray();
    const enemyTeam = generateTeam([Vampire, Undead, Daemon], 1, 1).toArray();

    this.placeTeam(playerTeam)

    // playerTeam.forEach((char) => {
    //   const position = this.getRandomPosition('player')
    //   const positionedCharacter = new PositionedCharacter(char, position)
    //   positionedCharacter.moveArray = this.getMoveArray(position, char)
    //   positionedCharacter.attackArray = this.getAttackArray(position, char)
    //   this.gameState.positionedChars.push(positionedCharacter);
    // });
    this.placeTeam(enemyTeam, 'enemy')
    // enemyTeam.forEach((char) => {
    //   const position = this.getRandomPosition('enemy')
    //   const positionedCharacter = new PositionedCharacter(char, position)
    //   positionedCharacter.moveArray = this.getMoveArray(position,char)
    //   positionedCharacter.attackArray = this.getAttackArray(position, char)
    //   this.gameState.positionedChars.push(positionedCharacter);
    // });

    this.gamePlay.redrawPositions(this.gameState.positionedChars);
  }

  placeTeam(team, player = 'player'){
    team.forEach((char) => {
      const position = this.getRandomPosition(player)
      const positionedCharacter = new PositionedCharacter(char, position)
      positionedCharacter.moveArray = this.getMoveArray(position, char)
      positionedCharacter.attackArray = this.getAttackArray(position, char)
      this.gameState.positionedChars.push(positionedCharacter);
    });

  }
  



  checkEmptyCell(index) {
    let empt = false;
    this.gameState.positionedChars.forEach((PositionedCharacter) => {
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
    const size = this.gamePlay.boardSize
    const leftBorder = Math.floor(x / size) * size;
    const rightBorder = leftBorder + size - 1;
    for (let step = 1; step <= char.move; step += 1) {      
      moveArray.push(x - step * size)
      moveArray.push(x + step * size)

      let y = x + step * (size + 1)
      if(y%size > x%size){moveArray.push(y)}

      y = x - step * (size - 1)
      if(y%size > x%size){moveArray.push(y)}

      y = x - step * (size + 1)
      if(y%size < x%size){moveArray.push(y)}
      
      y = x + step * (size - 1)
      if(y%size < x%size){moveArray.push(y)}
      
      if (x - step >= leftBorder) {moveArray.push(x - step)};
      if (x + step <= rightBorder) {moveArray.push(x + step)};
    };
    
    return moveArray.filter(elem => elem >= 0 && elem < size**2)

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
    return this.gameState.activeChar.attackArray.includes(index)
  }

  canMove(index){
    return this.gameState.activeChar.moveArray.includes(index)
  }

  move(index, char){
    if(this.gameState.userTurn){
      this.gamePlay.deselectCell(index)
      this.gamePlay.deselectCell(this.gameState.activeChar.position)
    }
    

    char.position = index
    char.moveArray = this.getMoveArray(index, char.character)
    char.attackArray = this.getAttackArray(index, char.character)

    this.gameState.activeCell = undefined
    this.gameState.activeChar = undefined

    this.gamePlay.redrawPositions(this.gameState.positionedChars)
    this.endRound()
  }

  attack(attacker, index){
    const target = this.checkEmptyCell(index).character
    const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1)
    console.log('damage', damage)
    console.log('defence',target.defence)
    console.log('target.health', target.health)
    this.gamePlay.showDamage(index, damage)    
    .then(() => {
      if(this.gameState.userTurn){
        this.gamePlay.deselectCell(index)
        this.gamePlay.deselectCell(this.gameState.activeChar.position)
        this.gameState.activeCell = undefined
        this.gameState.activeChar = undefined
      }      
      target.health -= damage
      this.gamePlay.redrawPositions(this.gameState.positionedChars)
      this.checkHealth(target, damage)
      this.endRound()
      
    })
    
  }

  comp(){
    const compTeam = this.gameState.positionedChars.filter(charPos => !['bowman', 'swordsman', 'magician'].includes(charPos.character.type))
    const userTeam = this.gameState.positionedChars.filter(charPos => ['bowman', 'swordsman', 'magician'].includes(charPos.character.type))
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
      } else {
        this.compMove()
      }
    
    
  }

  compMove(){
    const compTeam = this.gameState.positionedChars.filter(charPos => !['bowman', 'swordsman', 'magician'].includes(charPos.character.type))
    const userTeam = this.gameState.positionedChars.filter(charPos => ['bowman', 'swordsman', 'magician'].includes(charPos.character.type))
    const possibleMove = []    
    for (let comp of compTeam) {
      for(let user of userTeam){
          const bestMove = this.bestMove(comp, user)
          
          
          possibleMove.push({
            charPos: comp,
            moveTo: bestMove,
          })
          
        }
      }
    const random = possibleMove[Math.floor(Math.random() * possibleMove.length)]
    
    this.move(random.moveTo, random.charPos)     
  }

  endRound(){
    if(this.gameState.gameOver){return}
    if (this.gameState.userTurn){
      this.gameState.userTurn = false
      this.comp()
    } else {
      this.gameState.userTurn = true
    }
  }

  bestMove(comp, user){
    const targetColoumn = user.position % this.gamePlay.boardSize
    const bestPossibleMove = [...comp.moveArray]
    const idx = bestPossibleMove.indexOf(user.position)
    if(idx > -1)(bestPossibleMove.splice(idx,1))

    return bestPossibleMove
    .sort((a,b) => {
      return (a%this.gamePlay.boardSize - targetColoumn) - (b%this.gamePlay.boardSize - targetColoumn)
    })
    .slice(0, 3)
    .sort((a,b) => {
      (a - user.position) - (b-user.position)
    })[0]
    
  }

  checkHealth(target, damage){
    
    console.log('target.health after', target.health)
    if(target.health <=0){
      const idx = this.gameState.positionedChars.findIndex(char => char.character === target)
      this.gameState.positionedChars.splice(idx, 1)
      this.gamePlay.redrawPositions(this.gameState.positionedChars)
      this.checkWin()
    }
    
  }

  checkWin(){
    const compTeam = this.gameState.positionedChars.filter(charPos => !['bowman', 'swordsman', 'magician'].includes(charPos.character.type))
    const userTeam = this.gameState.positionedChars.filter(charPos => ['bowman', 'swordsman', 'magician'].includes(charPos.character.type))
    if (compTeam.length ===0){
      this.gameState.level += 1
      if(this.gameState.level > 3){
        this.endGame()
        return
      } else {
      alert('конец раунда')
      this.newLevel(userTeam)
      }
    }
    if(userTeam.length === 0){
      alert('Вы проиграли')
      this.endGame()
    }
  }

  newLevel(userTeam){
    this.gameState.userTurn = true
    
    console.log(this.gameState.level)
    this.upLevelChars(userTeam)
    this.placeTeam(generateTeam([Vampire, Undead, Daemon], 1, 1).toArray(), 'enemy')
    const newTheme = ['prairie', 'desert', 'arctic', 'mountain' ][this.gameState.level]
    this.gamePlay.drawUi(themes[newTheme])    
    
  }

  upLevelChars(userTeam){
    userTeam.forEach( charPos => {
      charPos.character.upgarde()
      const newPosition = this.getRandomPosition('player')
      charPos.position = newPosition
      charPos.moveArray = this.getMoveArray(newPosition, charPos.character)
      charPos.attackArray = this.getAttackArray(newPosition, charPos.character)
    })
  }

  endGame(){
    this.gameState.gameOver = true
    this.gamePlay.cellClickListeners = []
    this.gamePlay.cellEnterListeners = []
    this.gamePlay.cellLeaveListeners = []

  }
  
  onNewGameClick(){
    this.endGame()
    this.gamePlay.newGameListeners = []
    this.gamePlay.saveGameListeners = []
    this.gamePlay.loadGameListeners = []
    this.gameState = new GameState()
    this.init()

 
  }

  onSaveGameClick(){
    this.stateService.save(this.gameState)
    alert('игра сохранена')
  }

  onLoadGameClick(){
    this.gameState.from(this.stateService.load())
    
    const newTheme = ['prairie', 'desert', 'arctic', 'mountain' ][this.gameState.level]
    this.gamePlay.drawUi(themes[newTheme])
    this.gamePlay.redrawPositions(this.gameState.positionedChars) 
  }

}
