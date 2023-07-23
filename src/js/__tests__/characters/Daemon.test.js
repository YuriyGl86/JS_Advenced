import Daemon from '../../characters/Daemon';

test('shoud create object Daemon', () => {
  expect(new Daemon(3)).toBeInstanceOf(Daemon);
});

test('correct object class Daemon params', () => {
  const char = new Daemon(1);
  expect([char.attack, char.defence, char.health, char.type, char.level]).toEqual([10, 10, 50, 'daemon', 1]);
});
