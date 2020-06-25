export function migrateItem(item) {
  if(item.data.type === 'carriable' && !item.data.data.category) {
    item.update({
      data: {
        category: 'Miscellaneous',
      },
    });
  }
}