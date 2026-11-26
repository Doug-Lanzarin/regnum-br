// Jóias de Aquantis, transcritas dos prints do jogo e traduzidas.

const W = './magnanita/moeda-w.png'
const m = (id, name, qty) => ({ id, name, qty, icon: `./epicos/mat/${id}.png` })
const craft = (chance, time, level, materials, cost) => ({ chance, time, level, materials, costs: [{ coin: W, value: cost }] })

export const AQUANTIS_JEWELS = [
  {
    craft: craft(80, 5, 9, [
        m('coracao-aquantis', 'Coração de Aquantis Sob…', 20),
        m('olho-aquantis', 'Olho de Aquantis Soberano', 5),
        m('sopro-alma-antiga', 'Sopro de alma antiga', 1),
      ], 250000),
    id: 'anel-profundidade',
    name: 'Anel da Profundidade do Mar',
    icon: './aquantis/anel-profundidade.png',
    damage: { icon: './joias/dano/gelo.png', type: 'gelo', value: 29 },
    category: 'Anéis',
    weight: '10 g',
    itemLevel: 50,
    level: 50,
    lore: 'Este anel concentra o vigor e a constância das correntes na profundidade do mar.',
    stats: [{ text: 'Dano de gelo +29' }, { text: 'Atributo de classe +4' }],
  },
]
