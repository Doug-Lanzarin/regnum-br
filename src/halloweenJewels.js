// Jóias de Halloween, transcritas dos prints do jogo e traduzidas.

const icon = (id) => `./halloween/${id}.png`
const W = './magnanita/moeda-w.png'

const mats = (essenceQty, skinQty) => [
  { name: 'Lingote de liga esp…', icon: icon('lingote-liga'), qty: 1 },
  { name: 'Essência Necromântica de…', icon: icon('essencia-necromantica'), qty: essenceQty },
  { name: 'Pele de Dragão Zumbi', icon: icon('pele-dragao-zumbi'), qty: skinQty },
]

const amulet = (id, name, lore, stats) => ({
  id,
  name,
  icon: icon(id),
  category: 'Amuletos',
  weight: '150 g',
  itemLevel: 136,
  requires: 'Nível 40',
  lore,
  stats: stats.map((text) => ({ text })),
  upgrades: null,
  bound: true,
  craft: { chance: 100, time: 5, level: 9, materials: mats(16, 12) },
  costs: [{ coin: W, value: 90000 }],
})

export const HALLOWEEN_JEWELS = [
  amulet(
    'amuleto-sepulcral',
    'Amuleto Sepulcral de Vare Eidahan',
    'Este amuleto é formado por três caveiras feitas de uma liga de aço desconhecida, potencializadas com um cachecol confeccionado com os farrapos do necromante para dar ao seu dono a tenacidade necessária para enfrentar a morte, mesmo diante de inimigos distantes.',
    ['Atributo de classe +9', 'Vida +230', 'Dano à distância recebido -5%'],
  ),
  amulet(
    'amuleto-radiante',
    'Amuleto Radiante de Vare Eidahan',
    'Este amuleto, com caveiras feitas de uma liga de aço desconhecida que emanam uma escuridão que nem a luz mais brilhante consegue dissipar e um colar trançado de pele de dragão, concede a quem o possui tenacidade contra a morte.',
    ['Atributo de classe +9', 'Vida +230', 'Dano corpo a corpo recebido -5%'],
  ),
]
