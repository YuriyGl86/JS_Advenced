import Bowman from '../../characters/Bowman';

test('shoud create object Bowman', () => {
  expect(new Bowman(3)).toBeInstanceOf(Bowman);
});

test('correct object Bowman params', () => {
  const char = new Bowman(1);
  expect([char.attack, char.defence, char.health, char.type, char.level]).toEqual([25, 25, 50, 'bowman', 1]);
});
