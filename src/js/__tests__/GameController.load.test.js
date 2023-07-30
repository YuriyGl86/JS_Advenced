import GameController from '../GameController';
import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';

beforeAll(() => {
  jest.spyOn(GameStateService.prototype, 'load').mockImplementation(() => { throw new Error('Invalid state'); });
  jest.spyOn(GamePlay, 'showError').mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

test('shoud throw error', () => {
  const gamePlay = new GamePlay();
  const stateService = new GameStateService('localStorage');
  const gameCtrl = new GameController(gamePlay, stateService);

  gameCtrl.onLoadGameClick();
  expect(GamePlay.showError).toHaveBeenCalled();
});
