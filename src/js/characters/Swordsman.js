import Character from '../Character';

export default class Swordsman extends Character {
  constructor(level) {
    super(level, 'swordsman');
    this.attack = 40;
    this.defence = 10;
    this.move = 4;
    this.attackDist = 1;
    this.upgrade(level);
  }
}
