import Character from '../Character';

export default class Magician extends Character {
  constructor(level) {
    super(level, 'magician');
    this.attack = 10;
    this.defence = 40;
    this.move = 1;
    this.attackDist = 4;
    this.upgrade(level);
  }
}
