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
    if (new.target && new.target.name === 'Character') {
      throw new Error('It is forbidden to create new objects of the class Character');
    }

    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    // TODO: выбросите исключение, если кто-то использует "new Character()"
  }
}

const charProp ={
  bowman: {
    move: 2,
    atack: 2
  },
  daemon: {
    move: 1,
    atack: 4
  },
  magician: {
    move: 1,
    atack: 4
  },
  vampire: {
    move: 2,
    atack: 2
  },
  swordsman: {
    move: 4,
    atack: 1
  },
  undead: {
    move: 4,
    atack: 1
  }
}