import Character from '../Character';

export default class Bowman extends Character {
  constructor(level) {
    super(level, 'bowman');
    this.attack = 25;
    this.defence = 25;
    this.move = 2;
    this.attackDist = 2;
    this.upgarde(level);
  }
}
