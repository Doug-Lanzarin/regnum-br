// Conjunto Champion (armaduras e armas) por classe, transcrito dos prints do jogo e traduzido.
// cost = custo no jogo (moeda vermelha "C" dos prints).

const icon = (id) => `./champion/${id}.png`
const RES = 'Todas normais' // resistências: cortante, perfurante, esmagador, fogo, gelo e eletricidade

const ARQUEIRO = '#7bd389'
const GUERREIRO = '#ff8a5c'
const MAGO = '#8fb8ff'

const SET_DES = ['+10 Destreza', '+10% Velocidade de movimento (só em Battlezones)']
const SET_INT = ['+10 Inteligência', '+10% Velocidade de movimento (só em Battlezones)']
const SET_CON = ['+10 Constituição', '+10% Velocidade de movimento (só em Battlezones)']
const SET_FOR = ['+10 Força', '+10% Velocidade de movimento (só em Battlezones)']

/** Peça de armadura de aço fino (+9) ou tecido fino (+7) */
const armor = (id, name, category, weight, bonus, opts = {}, cost) => ({
  id,
  cost,
  name,
  icon: icon(id),
  armor: opts.armor ?? '250 (+9)',
  resist: RES,
  category,
  durability: opts.durability ?? 212,
  weight,
  stats: bonus ? bonus.map((text) => ({ text })) : [],
  upgrades: opts.upgrades ?? 3,
})

const cloth = (id, name, category, weight, bonus, upgrades = 5, cost) =>
  armor(id, name, category, weight, bonus, { armor: '250 (+7)', durability: 196, upgrades }, cost)

/** Arma de liga de aço (Arcano) */
const weapon = (id, name, category, damage, speed, range, crit) => ({
  id,
  cost: 250000,
  name,
  icon: icon(id),
  damage,
  category,
  speed,
  range,
  durability: 244,
  weight: '7 Kg',
  stats: [{ text: `Chance de crítico +${crit}%` }],
  socket: true,
})

const ARCO_LONGO = (cls, id, req) =>
  weapon(id, `Arco Longo de ${cls} Campeão de Liga de Aço (Arcano)`, 'Arcos longos', { icon: 'perfurante', value: '123-138', bonus: 39 }, 'Lenta', 30, 38)
const ARCO = (cls, id) =>
  weapon(id, `Arco de ${cls} Campeão de Liga de Aço (Arcano)`, 'Arcos curtos', { icon: 'perfurante', value: '97-117', bonus: 39 }, 'Média', 25, 38)
const CAJADO = (cls, id) =>
  weapon(id, `Cajado de ${cls} Campeão de Liga de Aço (Arcano)`, 'Cajados', { icon: 'eletrico', value: '48-57', bonus: 24 }, 'Rápida', 25, 24)

const withClass = (list, cls) => list.map((it) => ({ ...it, requires: `${cls} Nível 60` }))

const CLASSES = [
  { id: 'cavaleiro', label: 'Cavaleiro', color: GUERREIRO, set: SET_CON },
  { id: 'barbaro', label: 'Bárbaro', color: GUERREIRO, set: SET_FOR },
  { id: 'cacador', label: 'Caçador', color: ARQUEIRO, set: SET_DES },
  { id: 'atirador', label: 'Atirador', color: ARQUEIRO, set: SET_DES },
  { id: 'conjurador', label: 'Conjurador', color: MAGO, set: SET_INT },
  { id: 'bruxo', label: 'Bruxo', color: MAGO, set: SET_INT },
]

const ARMORS = {
  cavaleiro: [
    armor('cavaleiro-elmo', 'Elmo de Campeão Cavaleiro de Aço Fino (Artesão)', 'Elmos', '8 Kg', ['Mana +150'], {}, 40000),
    armor('cavaleiro-peitoral', 'Peitoral de Campeão Cavaleiro de Aço Fino (Artesão)', 'Peitorais', '30 Kg', ['Constituição +5'], {}, 50000),
    armor('cavaleiro-ombreiras', 'Ombreiras de Campeão Cavaleiro de Aço Fino (Artesão)', 'Ombreiras', '8 Kg', ['Constituição +5'], {}, 20000),
    armor('cavaleiro-manoplas', 'Manoplas de Campeão Cavaleiro de Aço Fino (Artesão)', 'Manoplas', '8 Kg', ['Chance de crítico +15%'], {}, 15000),
    armor('cavaleiro-perneiras', 'Perneiras de Campeão Cavaleiro de Aço Fino (Artesão)', 'Perneiras', '23 Kg', ['Velocidade de movimento +5%'], {}, 25000),
    armor('cavaleiro-escudo', 'Escudo de Campeão Cavaleiro de Aço Fino (Artesão)', 'Escudos', '20 Kg', ['Bloqueio +15', 'Constituição +5'], { upgrades: 0 }, 30000),
  ],
  barbaro: [
    armor('barbaro-elmo', 'Elmo de Campeão Bárbaro de Aço Fino (Artesão)', 'Elmos', '8 Kg', ['Mana +150'], {}, 50000),
    armor('barbaro-peitoral', 'Peitoral de Campeão Bárbaro de Aço Fino (Artesão)', 'Peitorais', '30 Kg', ['Constituição +5'], {}, 60000),
    armor('barbaro-ombreiras', 'Ombreiras de Campeão Bárbaro de Aço Fino (Artesão)', 'Ombreiras', '8 Kg', ['Força +5'], {}, 25000),
    armor('barbaro-manoplas', 'Manoplas de Campeão Bárbaro de Aço Fino (Artesão)', 'Manoplas', '8 Kg', ['Chance de crítico +15%'], {}, 15000),
    armor('barbaro-perneiras', 'Perneiras de Campeão Bárbaro de Aço Fino (Artesão)', 'Perneiras', '23 Kg', ['Velocidade de ataque +10%'], {}, 30000),
  ],
  cacador: [
    armor('cacador-elmo', 'Elmo de Campeão Caçador de Aço Fino (Artesão)', 'Elmos', '8 Kg', ['Mana +150'], {}, 50000),
    armor('cacador-peitoral', 'Peitoral de Campeão Caçador de Aço Fino (Artesão)', 'Peitorais', '29 Kg', ['Constituição +5'], {}, 60000),
    armor('cacador-ombreiras', 'Ombreiras de Campeão Caçador de Aço Fino (Artesão)', 'Ombreiras', '8 Kg', ['Constituição +5'], {}, 25000),
    armor('cacador-manoplas', 'Manoplas de Campeão Caçador de Aço Fino (Artesão)', 'Manoplas', '8 Kg', ['Velocidade de ataque +7%'], {}, 15000),
    armor('cacador-perneiras', 'Perneiras de Campeão Caçador de Aço Fino (Artesão)', 'Perneiras', '7 Kg', ['Velocidade de conjuração +5%'], {}, 30000),
  ],
  atirador: [
    armor('tirador-elmo', 'Elmo de Campeão Atirador de Aço Fino (Artesão)', 'Elmos', '8 Kg', ['Mana +200'], {}, 50000),
    armor('tirador-peitoral', 'Peitoral de Campeão Atirador de Aço Fino (Artesão)', 'Peitorais', '29 Kg', ['Constituição +5'], {}, 60000),
    armor('tirador-ombreiras', 'Ombreiras de Campeão Atirador de Aço Fino (Artesão)', 'Ombreiras', '8 Kg', ['Constituição +5'], {}, 25000),
    armor('tirador-manoplas', 'Manoplas de Campeão Atirador de Aço Fino (Artesão)', 'Manoplas', '8 Kg', ['Chance de crítico +15%'], {}, 15000),
    armor('tirador-perneiras', 'Perneiras de Campeão Atirador de Aço Fino (Artesão)', 'Perneiras', '7 Kg', ['Destreza +10'], {}, 30000),
  ],
  conjurador: [
    cloth('conjurador-tunica', 'Túnica de Campeão Conjurador de Tecido Fino (Artesão)', 'Túnicas', '10 Kg', ['Constituição +7'], 5, 70000),
    cloth('conjurador-luvas', 'Luvas de Campeão Conjurador de Tecido Fino (Artesão)', 'Luvas', '3 Kg', ['Velocidade de conjuração +10%'], 5, 20000),
    cloth('conjurador-chapeu', 'Chapéu de Campeão Conjurador de Tecido Fino (Artesão)', 'Chapéus', '3 Kg', null, 5, 60000),
    cloth('conjurador-bracelete', 'Bracelete de Campeão Conjurador de Tecido Fino (Artesão)', 'Braceletes', '500 g', ['Mana +150'], 0, 30000),
  ],
  bruxo: [
    cloth('bruxo-tunica', 'Túnica de Campeão Bruxo de Tecido Fino (Artesão)', 'Túnicas', '10 Kg', ['Constituição +10'], 5, 70000),
    cloth('bruxo-luvas', 'Luvas de Campeão Bruxo de Tecido Fino (Artesão)', 'Luvas', '3 Kg', ['Velocidade de conjuração +7%'], 5, 20000),
    armor('bruxo-chapeu', 'Chapéu de Campeão Bruxo de Aço Fino (Artesão)', 'Chapéus', '3 Kg', null, { upgrades: 5 }, 60000),
    cloth('bruxo-bracelete', 'Bracelete de Campeão Bruxo de Tecido Fino (Artesão)', 'Braceletes', '500 g', ['Mana +150'], 0, 30000),
  ],
}

const WEAPONS = {
  cacador: [ARCO_LONGO('Caçador', 'cacador-arco-longo'), ARCO('Caçador', 'cacador-arco')],
  atirador: [ARCO_LONGO('Atirador', 'tirador-arco-longo'), ARCO('Atirador', 'tirador-arco')],
  conjurador: [CAJADO('Conjurador', 'conjurador-cajado')],
  bruxo: [CAJADO('Bruxo', 'bruxo-cajado')],
}

const build = (map, withSet, onlyWithItems = false) =>
  CLASSES.filter((c) => !onlyWithItems || map[c.id]).map((c) => ({
    id: c.id,
    label: c.label,
    color: c.color,
    set: withSet && map[c.id] ? c.set : null,
    items: map[c.id] ? withClass(map[c.id], c.label) : null,
  }))

export const CHAMPION_ARMORS = build(ARMORS, true)
export const CHAMPION_WEAPONS = build(WEAPONS, false, true)
