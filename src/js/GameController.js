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

const Chars = {
  bowman: Bowman,
  swordsman: Swordsman,
  magician: Magician,
  vampire: Vampire,
  undead: Undead,
  daemon: Daemon,
};

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.placeTeams();
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));

    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));

    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
    const char = this.checkEmptyCell(index);

    if (char) {
      if (['bowman', 'swordsman', 'magician'].includes(char.character.type)) {
        if (this.gameState.activeChar) {
          this.gamePlay.deselectCell(this.gameState.activeChar.position);
        }
        this.gamePlay.selectCell(char.position);
        this.gameState.activeChar = char;
      } else if (this.gameState.activeChar) {
        if (this.canAtack(index)) {
          this.attack(this.gameState.activeChar.character, index);
        }
      } else {
        GamePlay.showError('It is not your character. Choose your character');
      }
    } else {
      // ветка щелчка по пустой клетке
      /* eslint no-lonely-if: 0 */
      if (this.gameState.activeChar) {
        if (this.canMove(index)) {
          this.move(index, this.gameState.activeChar);
        }
      } else {
        GamePlay.showError('It is not your character. Choose your character');
      }
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    if (!this.gameState.userTurn) { return; }

    if (this.gameState.activeChar
      && this.gameState.activeCell
      && this.gameState.activeCell !== this.gameState.activeChar.position) {
      this.gamePlay.deselectCell(this.gameState.activeCell);
    }
    const char = this.checkEmptyCell(index);
    if (char) {
      const msg = GameController.getTooltipMsg(char);
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
    while (true) { // eslint-disable-line no-constant-condition
      const randomCol = Math.round(Math.random()); // return 0 or 1
      if (player === 'player') {
        // random from 0 to boardSize-1 :
        const randomRow = Math.floor(Math.random() * this.gamePlay.boardSize);
        number = this.gamePlay.boardSize * randomRow + randomCol;
      } else if (player === 'enemy') {
        // return random from 1 to boardSize:
        const randomRow = Math.floor(Math.random() * (this.gamePlay.boardSize)) + 1;
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
    const playerTeam = generateTeam([Chars.bowman, Chars.magician, Chars.swordsman], 1, 2)
      .toArray();
    const enemyTeam = generateTeam([Chars.vampire, Chars.undead, Chars.daemon], 1, 2).toArray();

    this.placeTeam(playerTeam);
    this.placeTeam(enemyTeam, 'enemy');
    this.gamePlay.redrawPositions(this.gameState.positionedChars);
  }

  placeTeam(team, player = 'player') {
    team.forEach((char) => {
      const position = this.getRandomPosition(player);
      const positionedCharacter = new PositionedCharacter(char, position);
      positionedCharacter.moveArray = this.getMoveArray(position, char);
      positionedCharacter.attackArray = this.getAttackArray(position, char);
      this.gameState.positionedChars.push(positionedCharacter);
    });
  }

  checkEmptyCell(index) {
    let empt = false;
    this.gameState.positionedChars.forEach((charPos) => {
      if (charPos.position === index) {
        empt = charPos;
      }
    });
    return empt;
  }

  static getTooltipMsg(charPos) {
    const char = charPos.character;
    return `\u{1F396} ${char.level} \u{2694} ${char.attack} \u{1F6E1} ${char.defence} \u{2764} ${char.health}`;
  }

  getMoveArray(x, char) {
    const moveArray = [];
    const size = this.gamePlay.boardSize;
    const leftBorder = Math.floor(x / size) * size;
    const rightBorder = leftBorder + size - 1;
    for (let step = 1; step <= char.move; step += 1) {
      moveArray.push(x - step * size);
      moveArray.push(x + step * size);

      let y = x + step * (size + 1);
      if (y % size > x % size) { moveArray.push(y); }

      y = x - step * (size - 1);
      if (y % size > x % size) { moveArray.push(y); }

      y = x - step * (size + 1);
      if (y % size < x % size) { moveArray.push(y); }

      y = x + step * (size - 1);
      if (y % size < x % size) { moveArray.push(y); }

      if (x - step >= leftBorder) { moveArray.push(x - step); }
      if (x + step <= rightBorder) { moveArray.push(x + step); }
    }

    return moveArray.filter((elem) => elem >= 0 && elem < size ** 2);
  }

  getAttackArray(x, char) {
    const attackArray = [];
    const steps = char.attackDist;
    const leftBorder = Math.floor(x / this.gamePlay.boardSize) * this.gamePlay.boardSize;
    const rightBorder = leftBorder + this.gamePlay.boardSize - 1;
    const left = Math.max(leftBorder, x - steps);
    const right = Math.min(rightBorder, x + steps);

    for (let step = -steps; step <= steps; step += 1) {
      const start = left + step * this.gamePlay.boardSize;
      const end = right + step * this.gamePlay.boardSize;
      const range = [...Array(end - start + 1).keys()].map((i) => i + start);
      attackArray.push(...range);
    }
    return attackArray.filter((pos) => (
      pos >= 0
        && pos < this.gamePlay.boardSize ** 2
        && pos !== x
    ));
  }

  canAtack(index) {
    return this.gameState.activeChar.attackArray.includes(index);
  }

  canMove(index) {
    return this.gameState.activeChar.moveArray.includes(index);
  }

  move(index, character) {
    const char = character;
    if (this.gameState.userTurn) {
      this.gamePlay.deselectCell(index);
      this.gamePlay.deselectCell(this.gameState.activeChar.position);
    }

    char.position = index;
    char.moveArray = this.getMoveArray(index, char.character);
    char.attackArray = this.getAttackArray(index, char.character);

    this.gameState.activeCell = undefined;
    this.gameState.activeChar = undefined;

    this.gamePlay.redrawPositions(this.gameState.positionedChars);
    this.endRound();
  }

  attack(attacker, index) {
    const target = this.checkEmptyCell(index).character;
    const damage = Math.floor(Math.max(attacker.attack - target.defence, attacker.attack * 0.1));
    if (this.gameState.userTurn) {
      this.gamePlay.deselectCell(index);
      this.gamePlay.deselectCell(this.gameState.activeChar.position);
      this.gameState.activeCell = undefined;
      this.gameState.activeChar = undefined;
      this.saveScore(damage);
    }
    this.gamePlay.showDamage(index, damage)
      .then(() => {
        target.health -= damage;
        this.gamePlay.redrawPositions(this.gameState.positionedChars);
        this.checkHealth(target, damage);
        if (!this.gameState.gameOver) { this.endRound(); }
      });
  }

  comp() {
    const { userTeam, compTeam } = this.getTeams();
    const possibleAttack = [];
    for (const comp of compTeam) {
      for (const user of userTeam) {
        if (comp.attackArray.includes(user.position)) {
          const damage = Math.max(
            comp.character.attack - user.character.defence,
            comp.character.attack * 0.1,
          );
          possibleAttack.push({
            charPos: comp,
            damage,
            index: user.position,
          });
        }
      }
    }
    possibleAttack.sort((a, b) => (b.damage - a.damage));
    if (possibleAttack.length >= 1) {
      const attacker = possibleAttack[0].charPos.character;
      this.attack(attacker, possibleAttack[0].index);
    } else {
      this.compMove(userTeam, compTeam);
    }
  }

  compMove(userTeam, compTeam) {
    // const {userTeam, compTeam} = this.getTeams()
    const possibleMove = [];
    for (const comp of compTeam) {
      for (const user of userTeam) {
        const bestMove = this.bestMove(comp, user);

        possibleMove.push({
          charPos: comp,
          moveTo: bestMove,
        });
      }
    }
    const random = possibleMove[Math.floor(Math.random() * possibleMove.length)];

    this.move(random.moveTo, random.charPos);
  }

  endRound() {
    if (this.gameState.activeCell) {
      this.gamePlay.deselectCell(this.gameState.activeCell);
    }

    if (this.gameState.gameOver) { return; }
    if (this.gameState.userTurn) {
      this.gameState.userTurn = false;
      this.comp();
    } else {
      this.gameState.userTurn = true;
    }
  }

  bestMove(comp, user) {
    const targetColoumn = user.position % this.gamePlay.boardSize;
    const bestPossibleMove = [...comp.moveArray];
    const idx = bestPossibleMove.indexOf(user.position);
    if (idx > -1)(bestPossibleMove.splice(idx, 1));

    return bestPossibleMove
      .sort((a, b) => ((a % this.gamePlay.boardSize) - targetColoumn)
                        - ((b % this.gamePlay.boardSize) - targetColoumn))
      .slice(0, 3)
      .sort((a, b) => (a - user.position) - (b - user.position))[0];
  }

  checkHealth(target) {
    if (target.health <= 0) {
      const idx = this.gameState.positionedChars.findIndex((char) => char.character === target);
      this.gameState.positionedChars.splice(idx, 1);
      this.gamePlay.redrawPositions(this.gameState.positionedChars);
      this.checkWin();
    }
  }

  checkWin() {
    const { userTeam, compTeam } = this.getTeams();

    if (compTeam.length === 0) {
      this.gameState.level += 1;
      if (this.gameState.level > 3) {
        this.endGame();
        alert('Игра окончена. Вы выиграли'); // eslint-disable-line no-alert
        return;
      }
      alert('конец раунда'); // eslint-disable-line no-alert
      this.newLevel(userTeam);
    }
    if (userTeam.length === 0) {
      alert('Вы проиграли'); // eslint-disable-line no-alert
      this.endGame();
    }
  }

  getTeams() {
    const teams = {
      userTeam: [],
      compTeam: [],
    };
    for (const charPos of this.gameState.positionedChars) {
      if (['bowman', 'swordsman', 'magician'].includes(charPos.character.type)) {
        teams.userTeam.push(charPos);
      } else {
        teams.compTeam.push(charPos);
      }
    }

    return teams;
  }

  newLevel(userTeam) {
    this.gameState.userTurn = false;
    this.upLevelChars(userTeam);
    const newLavelEnemyCount = this.gameState.level + 2;
    this.placeTeam(generateTeam([Vampire, Undead, Daemon], this.gameState.level + 1, newLavelEnemyCount).toArray(), 'enemy');
    const newTheme = ['prairie', 'desert', 'arctic', 'mountain'][this.gameState.level];
    this.gamePlay.drawUi(themes[newTheme]);
    this.gamePlay.redrawPositions(this.gameState.positionedChars);
  }

  upLevelChars(userTeam) {
    userTeam.forEach((charPosition) => {
      const charPos = charPosition;
      charPos.character.upgrade(2);
      const newPosition = this.getRandomPosition('player');
      charPos.position = newPosition;
      charPos.moveArray = this.getMoveArray(newPosition, charPos.character);
      charPos.attackArray = this.getAttackArray(newPosition, charPos.character);
    });

    const additionChars = this.gameState.level + 2 - userTeam.length;
    this.placeTeam(generateTeam(
      [Chars.bowman, Chars.magician, Chars.swordsman],
      this.gameState.level + 1,
      additionChars,
    ).toArray());
  }

  endGame() {
    this.gameState.gameOver = true;
    this.gamePlay.cellClickListeners = [];
    this.gamePlay.cellEnterListeners = [];
    this.gamePlay.cellLeaveListeners = [];
  }

  onNewGameClick() {
    this.endGame();
    this.gamePlay.newGameListeners = [];
    this.gamePlay.saveGameListeners = [];
    this.gamePlay.loadGameListeners = [];
    const { maxScore } = this.gameState;
    this.gameState = new GameState();
    this.gameState.maxScore = maxScore;
    this.init();
  }

  onSaveGameClick() {
    this.stateService.save(this.gameState);
    alert('игра сохранена'); // eslint-disable-line no-alert
  }

  onLoadGameClick() {
    try {
      const loadData = this.stateService.load();
      this.onNewGameClick();
      this.gameState.from(loadData);
      const newTheme = Object.values(themes)[this.gameState.level];
      this.gamePlay.drawUi(themes[newTheme]);
      this.gamePlay.redrawPositions(this.gameState.positionedChars);
      this.restoreCharPos();
      alert('Игра загружена.'); // eslint-disable-line no-alert
    } catch (e) {
      GamePlay.showError(`ошибка загрузки: , ${e}`);
    }
  }

  restoreCharPos() {
    const restoredCharPosArray = [];
    this.gameState.positionedChars.forEach((charPos) => {
      const restoredChar = new Chars[charPos.character.type](charPos.character.level);

      for (const [key, value] of Object.entries(charPos.character)) {
        restoredChar[key] = value;
      }

      const newCharPos = new PositionedCharacter(restoredChar, charPos.position);
      newCharPos.attackArray = this.getAttackArray(charPos.position, restoredChar);
      newCharPos.moveArray = this.getMoveArray(charPos.position, restoredChar);
      restoredCharPosArray.push(newCharPos);
    });
    this.gameState.positionedChars = restoredCharPosArray;
    this.gameState.emtyCell = new Set();
  }

  saveScore(damage) {
    this.gameState.score += damage;
    if (this.gameState.score > this.gameState.maxScore) {
      this.gameState.maxScore = this.gameState.score;
    }
    console.log(this.gameState.score); // eslint-disable-line no-console
    console.log(this.gameState.maxScore); // eslint-disable-line no-console
  }
}
