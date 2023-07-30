import Character from '../Character';

test('creating new Character shoud throw error ', () => {
  expect(() => {
    const char = new Character();
    char.attack = 10;
  }).toThrow();
});
