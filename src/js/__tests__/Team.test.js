import Team from '../Team';
import Bowman from '../characters/Bowman';
import Undead from '../characters/Undead';

test('add new charackter', () => {
  const char = new Bowman();
  const team = new Team();
  team.add(char);
  expect(team.toArray()).toEqual([char]);
});

test('add duplicated charackter', () => {
  const char = new Bowman();
  const team = new Team();
  team.add(char);
  expect(() => {
    team.add(char);
  }).toThrow();
});

test('add all', () => {
  const char1 = new Bowman();
  const char2 = new Bowman();
  const char3 = new Undead();
  const team = new Team();
  team.addAll(char1, char2, char3);
  expect(team.toArray()).toEqual([char1, char2, char3]);
});
