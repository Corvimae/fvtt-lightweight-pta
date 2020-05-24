export function normalizePokemonName(name, id) {
    switch (id) {
      case 29: // Nidoran F
        return 'nidoranf';
      case 32: // Nidoran M
        return 'nidoranm';
      default:
        return name.toLowerCase().replace(/[.':\- ]/g, '');
    }
  }