import Character from '../Character';

test('creating new Character shoud throw error ', () => {
  expect(() => {
    new Character();
  }).toThrow();
});
