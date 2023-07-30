import GameController from '../GameController';
import PositionedCharacter from '../PositionedCharacter';
import Bowman from '../characters/Bowman';
import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';
import Daemon from '../characters/Daemon';
import Magician from '../characters/Magician';
import Swordsman from '../characters/Swordsman';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';


test.each([
  [1, 1, 25, 25, 50],
  [2, 2, 32.5, 32.5, 100],
  [3, 3, 58.5, 58.5, 100],
])(
  ('shoud return correct string for char level %s'),
  (levl, levlCheck, attack, defence, health) => {
    const charPos = new PositionedCharacter(new Bowman(levl), 10);
    const str = GameController.getTooltipMsg(charPos);
    expect(str).toBe(`\u{1F396} ${levlCheck} \u{2694} ${attack} \u{1F6E1} ${defence} \u{2764} ${health}`);
  },
);



test.each([
  [Bowman, 0, [1, 2, 8, 16, 9, 18]],
  [Bowman, 35, [17, 26, 44, 53, 19, 27, 43, 51, 21, 28, 42, 49, 33, 34, 36, 37]],
  [Daemon, 56, [48,49,57]],
  [Daemon, 29, [20,21,22,28,30,36,37,38]],
  [Magician, 7, [6,14,15]],
  [Magician, 9, [0,1,2,8,10,16,17,18]],
  [Swordsman, 63, [27,36,45,54,31,39,47,55,62,61,60,59]],
  [Undead, 3, [0,1,2,4,5,6,7,10,17,24,12,21,30,39,11,19,27,35]],
  [Vampire, 37, [19,28,46,55,21,29,45,53,23,30,44,51,35,36,38,39]],

])(
  ('shoud return correct moveArray for %s in position %i'),
  (char, pos, arr) => {
    const gamePlay = new GamePlay();
    const stateService = new GameStateService('localStorage');
    const gameCtrl = new GameController(gamePlay, stateService);

    const character = new char(); // eslint-disable-line new-cap
    const res = gameCtrl.getMoveArray(pos, character).sort((a, b) => (a - b));
    // console.log(res)
    expect(res).toEqual(arr.sort((a, b) => (a - b)));
  },
);



test.each([
    [Bowman, 0, [1,2,8,9,10,16,17,18]],
    [Daemon, 56, [24,25,26,27,32,33,34,35,40,41,42,43,48,49,50,51,57,58,59,60,52,44,36,28]],
    [Magician, 7, [3,4,5,6,11,12,13,14,15,19,20,21,22,23,27,28,29,30,31,35,36,37,38,39]],
    [Swordsman, 63, [54,55,62]],
    [Undead, 3, [2,4,10,11,12]],
    [Vampire, 37, [19,20,21,22,23,27,28,29,30,31,35,36,38,39,43,44,45,46,47,51,52,53,54,55]],
  
  ])(
    ('shoud return correct attackArray for %s in position %i'),
    (char, pos, arr) => {
      const gamePlay = new GamePlay();
      const stateService = new GameStateService('localStorage');
      const gameCtrl = new GameController(gamePlay, stateService);
  
      const character = new char(); // eslint-disable-line new-cap
      const res = gameCtrl.getAttackArray(pos, character).sort((a, b) => (a - b));
    //   console.log(res)
      expect(res).toEqual(arr.sort((a, b) => (a - b)));
    },
  );