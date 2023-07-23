import Undead from '../../characters/Undead';

test('shoud create object Undead', () => {
  expect(new Undead(3)).toBeInstanceOf(Undead);
});

test('correct object class Undead params', () => {
  const char = new Undead(1);
  expect([char.attack, char.defence, char.health, char.type, char.level]).toEqual([40, 10, 50, 'undead', 1]);
});
