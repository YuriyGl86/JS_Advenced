/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
export default class Team {
  // TODO: write your logic here
  constructor() {
    this.members = new Set();
  }

  add(cheracter) {
    if (this.members.has(cheracter)) {
      throw new Error('такой персонаж уже есть в команде');
    }
    this.members.add(cheracter);
  }

  addAll(...newCharacters) {
    newCharacters.forEach((cheracter) => {
      this.members.add(cheracter);
    });
  }

  toArray() {
    return Array.from(this.members);
  }
}
