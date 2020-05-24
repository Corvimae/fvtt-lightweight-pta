import { normalizePokemonName, fetchPokemonData } from '../utils/pokemon-utils.js';

export function renderEntitySheetConfig(sheet, _element, entity) {
  if(entity.object.type === 'pokemon' && entity.sheetClasses.indexOf('pta.PokemonManagerSheet') !== -1) {
    const form = sheet.element[0].querySelector('form');

    const sheetIDContainer = document.createElement('div');

    sheetIDContainer.classList = ['form-group'];

    const sheetIDLabel = document.createElement('label');

    sheetIDLabel.textContent = 'Pokemon Manager ID';

    const sheetIDInput = document.createElement('input');

    sheetIDInput.type = 'text';
    sheetIDInput.value = entity.object.data.sheetID;
    sheetIDInput['data-dtype'] = 'Number';

    sheetIDContainer.appendChild(sheetIDLabel);
    sheetIDContainer.appendChild(sheetIDInput);

    form.lastElementChild.previousElementSibling.append(sheetIDContainer);

    sheet.element[0].style.height = '220px';

    const submitButton = form.querySelector('button[type=submit]');

    submitButton.addEventListener('click', async () => {
      const rawSheetIDValue = parseInt(sheetIDInput.value, 10);
      const sheetIDValue = Number.isNaN(rawSheetIDValue) ? 0 : rawSheetIDValue;
      const actor = game.actors.get(entity.object._id);
      const updatedData = {
        'data.sheetID': sheetIDValue,
      };

      // Get Pokemon data from the API.

      if(sheetIDValue !== 0) {
        const pokemonData = await fetchPokemonData(sheetIDValue);
        
        updatedData.name = pokemonData.name;
        updatedData['token.name'] = pokemonData.name;

        const dataModule = game.modules.get('pokemon-manager-data');
        if (dataModule?.active) {
          updatedData.img = `modules/pokemon-manager-data/assets/sprites/${normalizePokemonName(pokemonData.species.name, pokemonData.species.id)}.png`;
          updatedData['token.img'] =  `modules/pokemon-manager-data/assets/sprites/webm/${normalizePokemonName(pokemonData.species.name, pokemonData.species.id)}.webm`;
        }
      }

      actor.update(updatedData);
    });
  }
}