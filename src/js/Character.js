/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(level, type = 'generic') {
    // TODO: выбросите исключение, если кто-то использует "new Character()"
    if (new.target && new.target.name === 'Character') {
      throw new Error('It is forbidden to create new objects of the class Character');
    }

    this.level = 1;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
  }

  upgrade(levels) {
    for (let i = 1; i < levels; i += 1) {
      this.attack = Math.floor(Math.max(this.attack, this.attack * ((80 + this.health) / 100)));
      this.defence = Math.floor(Math.max(this.defence, this.defence * ((80 + this.health) / 100)));
      this.health = Math.min(100, this.health + 80);
      this.level += 1;
    }
  }
}
