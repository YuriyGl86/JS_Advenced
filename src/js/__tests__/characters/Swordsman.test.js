import Swordsman from '../../characters/Swordsman';

test('shoud create object Swordsman', () => {
  expect(new Swordsman(3)).toBeInstanceOf(Swordsman);
});

test('correct object class Swordsman params', () => {
  const char = new Swordsman(1);
  expect([char.attack, char.defence, char.health, char.type, char.level]).toEqual([40, 10, 50, 'swordsman', 1]);
});
