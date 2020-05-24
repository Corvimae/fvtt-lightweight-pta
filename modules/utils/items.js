export function getTagsForItem(item) {
  switch (item.type) {
    case 'feature':
      return [`Target: ${item.data.data.target || 'None'}`];

    default:
      return [];
  }
}