export default class GameStateService {
  constructor(storage) {
    this.storage = storage;
  }

  save(state) {
    const saveGame = structuredClone(state);
    saveGame.positionedChars.forEach((charPos) => {
      charPos.moveArray = []; // eslint-disable-line no-param-reassign
      charPos.attackArray = []; // eslint-disable-line no-param-reassign
    });

    this.storage.setItem('state', JSON.stringify(saveGame));
  }

  load() {
    try {
      return JSON.parse(this.storage.getItem('state'));
    } catch (e) {
      throw new Error('Invalid state');
    }
  }
}
