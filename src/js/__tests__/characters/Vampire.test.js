import Vampire from '../../characters/Vampire';

test('shoud create object Vampire', () => {
  expect(new Vampire(3)).toBeInstanceOf(Vampire);
});

test('correct object class Vampire params', () => {
  const char = new Vampire(1);
  expect([char.attack, char.defence, char.health, char.type, char.level]).toEqual([25, 25, 50, 'vampire', 1]);
});
