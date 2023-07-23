/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
import Team from './Team';

export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  const types = allowedTypes;
  const max = maxLevel;
  while (true) {
    const randomClass = types[Math.floor(Math.random() * types.length)];
    const randomLavel = Math.floor(Math.random() * max) + 1;
    yield new randomClass(randomLavel);
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей.
 * Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const team = new Team();
  const generator = characterGenerator(allowedTypes, maxLevel);
  for (let i = 1; i <= characterCount; i += 1) {
    team.add(generator.next().value);
  }
  return team;
}
