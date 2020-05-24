import { buildCommandForMove } from "../macros/macros.js";

export async function handleItemDrop(item, position) {
  if (item.type === 'move') createMoveAtHotbarPosition(item, position);
}

export async function createMoveAtHotbarPosition(item, position) {
  const macro = await Macro.create({
    name: item.name,
    type: 'script',
    img: item.img,
    command: buildCommandForMove(item.data),
  });

  game.user.assignHotbarMacro(macro, position);
}