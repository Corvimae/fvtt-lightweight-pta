export class PTAActor extends Actor {
  prepareData() {
    super.prepareData();

    if (this.data.type === 'trainer') this.prepareCharacterData();
  }

  prepareCharacterData() {
    const characterData = this.data.data;
    
    characterData.resources.health.max = characterData.stats.hp.value * 4 + characterData.level * 4;

    characterData.stab = Math.max(1, Math.floor(characterData.level / 5));
  }
}