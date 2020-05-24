import { buildCommandForMove } from "../macros/macros.js";

export async function handleItemDrop(item, position) {
  console.log(item);
  if (item.type === 'move') handleMoveDrop(item, position);
}

async function handleMoveDrop(item, position) {
  const macro = await Macro.create({
    name: item.name,
    type: 'script',
    img: item.img,
    command: buildCommandForMove(item.data.data),
  });

  game.user.assignHotbarMacro(macro, position);
}