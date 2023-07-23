import Magician from '../../characters/Magician';

test('shoud create object Magician', () => {
  expect(new Magician(3)).toBeInstanceOf(Magician);
});

test('correct object class Magician params', () => {
  const char = new Magician(1);
  expect([char.attack, char.defence, char.health, char.type, char.level]).toEqual([10, 40, 50, 'magician', 1]);
});
