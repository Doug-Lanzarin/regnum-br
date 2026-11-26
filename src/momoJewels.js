// Jóias do Rei Momo (Carnaval), transcritas dos prints do jogo e traduzidas.

const icon = (id) => `./momo/${id}.png`

export const MOMO_JEWELS = [
  {
    id: 'anel-coragem',
    name: 'Anel da Coragem do Rei Momo',
    icon: icon('anel-coragem'),
    damage: { icon: './joias/dano/esmagamento.png', type: 'esmagador', value: 30 },
    category: 'Anéis',
    weight: '5 g',
    itemLevel: 113,
    level: 55,
    lore: 'Este anel envolve quem o usa com a coragem do Rei Momo.',
    stats: [{ text: 'Dano esmagador +30' }, { text: 'Vida +150' }],
  },
  {
    id: 'anel-tenacidade',
    name: 'Anel da Tenacidade do Rei Momo',
    icon: icon('anel-tenacidade'),
    category: 'Anéis',
    weight: '5 g',
    itemLevel: 88,
    level: 55,
    lore: 'Este anel envolve quem o usa com a tenacidade do Rei Momo.',
    stats: [{ text: 'Mana +125' }, { text: 'Velocidade de conjuração +6%' }],
  },
]
