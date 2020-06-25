export function migrateItem(item) {
  if(item.data.type === 'carriable' && item.data.data.category === undefined) {
    console.log('blank')
    item.update({
      data: {
        category: '',
      },
    });
  }
}