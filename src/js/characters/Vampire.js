import Character from '../Character';

export default class Vampire extends Character {
  constructor(level) {
    super(level, 'vampire');
    this.attack = 25;
    this.defence = 25;
    this.move = 2;
    this.attackDist = 2;
    this.upgarde(level);
  }
}
