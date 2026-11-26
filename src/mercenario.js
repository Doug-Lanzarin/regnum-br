// Conjunto Mercenário (armaduras) por classe, transcrito da imagem do jogo e traduzido.
// resist = [cortante, perfurante, esmagador, fogo, gelo, eletricidade]

const icon = (id) => `./mercenario/${id}.png`
const N = 'Normal'
const B = 'Boa'
const R = 'Ruim'

const piece = (cls, material) => (id, name, category, weight, itemLevel, resist, bonus, upgrades) => ({
  id,
  name: `${name} de Mercenário de ${material} (Mestre)`,
  icon: icon(id),
  armor: '240 (+8)',
  resist,
  category,
  durability: '202',
  weight,
  itemLevel,
  requires: `${cls} Nível 55`,
  stats: [{ text: bonus }],
  upgrades,
})

const guer = piece('Guerreiro', 'Aço Fino')
const arq = piece('Arqueiro', 'Aço Fino')
const mago = piece('Mago', 'Tecido Etéreo')

const RES_GUER = [N, B, N, R, N, N]
const RES_ARQ = [N, B, N, N, N, R]
const RES_MAGO = [N, B, N, N, R, N]
const SET = ['+20% Regeneração de vida']

export const MERCENARIO_ARMORS = [
  {
    id: 'guerreiro',
    label: 'Guerreiro',
    color: '#ff8a5c',
    setTitle: 'Bônus com as 5 peças do conjunto Mercenário',
    set: SET,
    items: [
      guer('guer-elmo', 'Elmo', 'Elmos', '7 Kg', 63, RES_GUER, 'Bônus de armadura +3%', 2),
      guer('guer-ombreiras', 'Ombreiras', 'Ombreiras', '7 Kg', 63, RES_GUER, 'Resistir dano perfurante +3%', 2),
      guer('guer-peitoral', 'Peitoral', 'Peitorais', '26 Kg', 70, [N, N, B, R, N, N], 'Constituição +5', 2),
      guer('guer-manoplas', 'Manoplas', 'Manoplas', '7 Kg', 67, RES_GUER, 'Força +3', 2),
      guer('guer-perneiras', 'Perneiras', 'Perneiras', '20 Kg', 63, RES_GUER, 'Bônus de cura +2%', 2),
    ],
  },
  {
    id: 'arqueiro',
    label: 'Arqueiro',
    color: '#7bd389',
    setTitle: 'Bônus com as 5 peças do conjunto Mercenário',
    set: SET,
    items: [
      arq('arq-elmo', 'Elmo', 'Elmos', '7 Kg', 63, RES_ARQ, 'Bônus de armadura +3%', 2),
      arq('arq-ombreiras', 'Ombreiras', 'Ombreiras', '7 Kg', 63, RES_ARQ, 'Resistir dano cortante +3%', 2),
      arq('arq-peitoral', 'Peitoral', 'Peitorais', '26 Kg', 70, RES_ARQ, 'Constituição +5', 2),
      arq('arq-manoplas', 'Manoplas', 'Manoplas', '7 Kg', 67, RES_ARQ, 'Destreza +3', 2),
      arq('arq-perneiras', 'Perneiras', 'Perneiras', '20 Kg', 63, RES_ARQ, 'Bônus de cura +2%', 2),
    ],
  },
  {
    id: 'mago',
    label: 'Mago',
    color: '#8fb8ff',
    setTitle: 'Bônus com as 4 peças do conjunto Mercenário',
    set: SET,
    items: [
      mago('mago-bracelete', 'Bracelete', 'Braceletes', '500 g', 63, RES_MAGO, 'Velocidade de conjuração +5%', 0),
      mago('mago-chapeu', 'Chapéu', 'Chapéus', '3 Kg', 63, RES_MAGO, 'Bônus de armadura +3%', 3),
      mago('mago-luvas', 'Luvas', 'Luvas', '250 g', 67, RES_MAGO, 'Concentração +3', 3),
      mago('mago-tunica', 'Túnica', 'Túnicas', '6 Kg', 70, RES_MAGO, 'Inteligência +5', 4),
    ],
  },
]
