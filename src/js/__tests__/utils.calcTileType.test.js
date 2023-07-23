import { calcTileType } from '../utils';

test.each([
  [0, 8, 'top-left'],
  [1, 8, 'top'],
  [63, 8, 'bottom-right'],
  [7, 7, 'left'],
  [9, 5, 'right'],
  [3, 4, 'top-right'],
  [56, 8, 'bottom-left'],
  [57, 8, 'bottom'],
  [14, 11, 'center'],
])(
  ('for index %i and boardSize %i shoud return %s'),
  (index, boardSize, result) => {
    expect(calcTileType(index, boardSize)).toBe(result);
  },
);

test.each([
  [-1, 8],
  [64, 8],
])(
  ('for index %i and boardSize %i shoud throw Error'),
  (index, boardSize) => {
    expect(() => {
      calcTileType(index, boardSize);
    }).toThrow();
  },
);
