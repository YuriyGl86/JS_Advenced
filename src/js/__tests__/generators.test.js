import { characterGenerator, generateTeam } from '../generators';
import Bowman from '../characters/Bowman';
// import Daemon from '../characters/Daemon';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';
// import Vampire from '../characters/Vampire';
// import Undead from '../characters/Undead';

test('infinity chars from generator', () => {
  const gen = characterGenerator([Bowman, Magician, Swordsman], 3);
  const types = ['bowman', 'magician', 'swordsman'];
  for (let i = 1; i < 200; i += 1) {
    const char = gen.next();
    expect(types).toContain(char.value.type);
    expect(char.value.level).toBeLessThanOrEqual(3);
  }
});

test('shoud generate correct team', () => {
  const allowedTypes = [Bowman, Magician, Swordsman];
  const maxLevel = 3;
  const charCount = 10;
  const types = ['bowman', 'magician', 'swordsman'];
  const team = generateTeam(allowedTypes, maxLevel, charCount);
  expect(team.members.size).toBe(charCount);
  for (const char of team.toArray()) {
    expect(types).toContain(char.type);
    expect(char.level).toBeLessThanOrEqual(maxLevel);
  }
});
