// Conjunto Magnanita (armaduras) por classe, transcrito dos prints do jogo e traduzido.
// resist = [cortante, perfurante, esmagador, fogo, gelo, eletricidade]

const icon = (id) => `./magnanita/${id}.png`
const KIT = { name: 'Kit de armadura básico', icon: icon('kit-armadura-basico') }
const LINGOTE = { name: 'Lingote de Magnanita', icon: icon('lingote-magnanita') }

const R = 'Ruim'
const B = 'Boa'
const N = 'Normal'
const RES_GUERREIRO = [R, R, R, B, B, B]
const RES_MAGO = [B, B, B, R, R, R]
const RES_CACADOR = [N, R, N, B, B, R]

const ARQUEIRO = '#7bd389'
const GUERREIRO = '#ff8a5c'
const MAGO = '#8fb8ff'

const D = 24 * 3600
const t = (days, h, m, s = 0) => days * D + h * 3600 + m * 60 + s
const T_2D = t(2, 7, 33, 20)
const T_3D = t(3, 11, 20)
const T_4D = t(4, 15, 6, 40)
const T_6D = t(6, 22, 40)
const T_8D = t(8, 2, 26, 40)
const T_9D = t(9, 6, 13, 20)

/** Peça Magnanita: (id, nome, categoria, peso, lingotes, tempo, custo, opções) */
const piece = (cls, res) => (id, name, category, weight, ingots, time, cost, opts = {}) => ({
  id,
  name,
  icon: icon(id),
  armor: '255 (+17)',
  resist: res,
  category,
  durability: '270/270',
  weight,
  itemLevel: 74,
  requires: `${cls} Nível 55`,
  stats: (opts.bonus ?? []).map((text) => ({ text })),
  upgrades: opts.upgrades ?? 4,
  paintable: opts.paintable ?? true,
  bound: true,
  craft: {
    chance: 100,
    time,
    level: 9,
    materials: [
      { ...KIT, qty: 1 },
      { ...LINGOTE, qty: ingots },
    ],
  },
  cost,
  coin: icon('moeda-w'),
})

const barbaro = piece('Bárbaro', RES_GUERREIRO)
const cavaleiro = piece('Cavaleiro', RES_GUERREIRO)
const cacador = piece('Caçador', RES_CACADOR)
const atirador = piece('Atirador', RES_CACADOR)
const bruxo = piece('Bruxo', RES_MAGO)
const conjurador = piece('Conjurador', RES_MAGO)

export const MAGNANITA_ARMORS = [
  {
    id: 'cavaleiro',
    label: 'Cavaleiro',
    color: GUERREIRO,
    setTitle: 'Bônus com as 6 peças do conjunto Magnanita',
    set: ['+10% Bônus de armadura', '+10 Constituição'],
    items: [
      cavaleiro('cavaleiro-elmo', 'Elmo Ancestral de Cavaleiro de Magnanita (Artesão)', 'Elmos', '6 Kg', 3, T_3D, 30000),
      cavaleiro('cavaleiro-peitoral', 'Peitoral Ancestral de Cavaleiro de Magnanita (Artesão)', 'Peitorais', '23 Kg', 6, T_6D, 90000),
      cavaleiro('cavaleiro-ombreiras', 'Ombreiras Ancestrais de Cavaleiro de Magnanita (Artesão)', 'Ombreiras', '6 Kg', 2, T_2D, 30000),
      cavaleiro('cavaleiro-manoplas', 'Manoplas Ancestrais de Cavaleiro de Magnanita (Artesão)', 'Manoplas', '6 Kg', 2, T_2D, 30000),
      cavaleiro('cavaleiro-perneiras', 'Perneiras Ancestrais de Cavaleiro de Magnanita (Artesão)', 'Perneiras', '13 Kg', 4, T_4D, 60000),
      cavaleiro('cavaleiro-escudo', 'Escudo Ancestral de Cavaleiro de Magnanita (Artesão)', 'Escudos', '18 Kg', 4, T_4D, 60000, {
        bonus: ['Bloqueio +16'],
        upgrades: 0,
      }),
    ],
  },
  {
    id: 'barbaro',
    label: 'Bárbaro',
    color: GUERREIRO,
    setTitle: 'Bônus com as 5 peças do conjunto Magnanita',
    set: ['+10% Chance absoluta de crítico', '+10 Força'],
    items: [
      barbaro('barbaro-elmo', 'Elmo Ancestral de Bárbaro de Magnanita (Artesão)', 'Elmos', '6 Kg', 3, T_3D, 45000),
      barbaro('barbaro-peitoral', 'Peitoral Ancestral de Bárbaro de Magnanita (Artesão)', 'Peitorais', '23 Kg', 7, T_8D, 105000),
      barbaro('barbaro-ombreiras', 'Ombreiras Ancestrais de Bárbaro de Magnanita (Artesão)', 'Ombreiras', '6 Kg', 3, T_3D, 45000),
      barbaro('barbaro-manoplas', 'Manoplas Ancestrais de Bárbaro de Magnanita (Artesão)', 'Manoplas', '6 Kg', 3, T_3D, 45000),
      barbaro('barbaro-perneiras', 'Perneiras Ancestrais de Bárbaro de Magnanita (Artesão)', 'Perneiras', '16 Kg', 4, T_4D, 60000),
    ],
  },
  {
    id: 'cacador',
    label: 'Caçador',
    color: ARQUEIRO,
    setTitle: 'Bônus com as 5 peças do conjunto Magnanita',
    set: ['+12% Alcance de ataque', '+10 Destreza'],
    items: [
      cacador('cacador-elmo', 'Elmo Ancestral de Caçador de Magnanita (Artesão)', 'Elmos', '6 Kg', 3, T_3D, 45000),
      cacador('cacador-peitoral', 'Peitoral Ancestral de Caçador de Magnanita (Artesão)', 'Peitorais', '23 Kg', 7, T_8D, 105000),
      cacador('cacador-ombreiras', 'Ombreiras Ancestrais de Caçador de Magnanita (Artesão)', 'Ombreiras', '6 Kg', 3, T_3D, 45000),
      cacador('cacador-manoplas', 'Manoplas Ancestrais de Caçador de Magnanita (Artesão)', 'Manoplas', '6 Kg', 3, T_3D, 45000),
      cacador('cacador-perneiras', 'Perneiras Ancestrais de Caçador de Magnanita (Artesão)', 'Perneiras', '13 Kg', 4, T_4D, 60000),
    ],
  },
  {
    id: 'atirador',
    label: 'Atirador',
    color: ARQUEIRO,
    setTitle: 'Bônus com as 5 peças do conjunto Magnanita',
    set: ['+10% Alcance de ataque', '+12 Destreza'],
    items: [
      atirador('atirador-elmo', 'Elmo Ancestral de Atirador de Magnanita (Artesão)', 'Elmos', '6 Kg', 3, T_3D, 45000),
      atirador('atirador-peitoral', 'Peitoral Ancestral de Atirador de Magnanita (Artesão)', 'Peitorais', '23 Kg', 7, T_8D, 105000),
      atirador('atirador-ombreiras', 'Ombreiras Ancestrais de Atirador de Magnanita (Artesão)', 'Ombreiras', '6 Kg', 3, T_3D, 45000),
      atirador('atirador-manoplas', 'Manoplas Ancestrais de Atirador de Magnanita (Artesão)', 'Manoplas', '6 Kg', 3, T_3D, 45000),
      atirador('atirador-perneiras', 'Perneiras Ancestrais de Atirador de Magnanita (Artesão)', 'Perneiras', '13 Kg', 4, T_4D, 60000),
    ],
  },
  {
    id: 'conjurador',
    label: 'Conjurador',
    color: MAGO,
    setTitle: 'Bônus com as 4 peças do conjunto Magnanita',
    set: ['+10% Velocidade de conjuração', '+15 Inteligência'],
    items: [
      conjurador('conjurador-tunica', 'Túnica Ancestral de Conjurador de Magnanita (Artesão)', 'Túnicas', '9 Kg', 8, T_9D, 120000, { upgrades: 7 }),
      conjurador('conjurador-chapeu', 'Chapéu Ancestral de Conjurador de Magnanita (Artesão)', 'Chapéus', '2 Kg', 6, T_6D, 90000, { upgrades: 6 }),
      conjurador('conjurador-luvas', 'Luvas Ancestrais de Conjurador de Magnanita (Artesão)', 'Luvas', '2 Kg', 2, T_2D, 30000, { upgrades: 6 }),
      conjurador('conjurador-bracelete', 'Bracelete Ancestral de Conjurador de Magnanita (Artesão)', 'Braceletes', '500 g', 4, T_4D, 60000, {
        upgrades: 1,
        paintable: false,
      }),
    ],
  },
  {
    id: 'bruxo',
    label: 'Bruxo',
    color: MAGO,
    setTitle: 'Bônus com as 4 peças do conjunto Magnanita',
    set: ['+15% Velocidade de conjuração', '+10 Inteligência'],
    items: [
      bruxo('bruxo-tunica', 'Túnica Ancestral de Bruxo de Magnanita (Artesão)', 'Túnicas', '9 Kg', 8, T_9D, 120000, { upgrades: 7 }),
      bruxo('bruxo-chapeu', 'Chapéu Ancestral de Bruxo de Magnanita (Artesão)', 'Chapéus', '2 Kg', 6, T_6D, 90000, { upgrades: 6 }),
      bruxo('bruxo-luvas', 'Luvas Ancestrais de Bruxo de Magnanita (Artesão)', 'Luvas', '2 Kg', 2, T_2D, 30000, { upgrades: 6 }),
      bruxo('bruxo-bracelete', 'Bracelete Ancestral de Bruxo de Magnanita (Artesão)', 'Braceletes', '500 g', 4, T_4D, 60000, {
        upgrades: 1,
        paintable: false,
      }),
    ],
  },
]
