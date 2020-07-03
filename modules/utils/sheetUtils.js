// From https://gitlab.com/foundrynet/dnd5e/-/blob/master/module/actor/sheets/base.js#L372
export function handleChangeInputDelta(data, event) {
  const input = event.target;
  const value = input.value;

  console.log(input, value);
  
  if (['+', '-'].includes(value[0])) {
    let delta = parseFloat(value);

    input.value = getProperty(data, input.name) + delta;
  } else if (value[0] === '=') {
    input.value = value.slice(1);
  }
}