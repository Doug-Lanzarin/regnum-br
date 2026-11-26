// Armas dos épicos, transcritas dos prints do jogo e traduzidas.
// damage.parts = [tipo, valor]; tipos: cortante, perfurante, esmagamento, fogo, gelo, eletrico

const icon = (id) => `./epicos/${id}.png`

const w = (id, name, o) => ({
  id,
  name,
  icon: o.icon === false ? null : icon(id),
  damage: { bonus: o.bonus, parts: o.parts },
  category: o.category,
  speed: o.speed,
  range: o.range,
  durability: o.durability ?? '202/202',
  weight: o.weight,
  itemLevel: o.level,
  requires: `${o.cls} Nível 55`,
  stats: o.stats.map((text) => ({ text })),
  rarity: o.rarity ?? 'Épico',
  lore: o.lore,
  section: o.section ?? 'Novas',
})

const NEW_WEAPONS = {
  daenrha: [
    w('daen-bengala', 'Bengala Fulminante do Vingador de Aço Fino (Mestre)', {
      bonus: 21, parts: [['fogo', '55-68'], ['eletrico', '11-16']],
      category: 'Cajados', speed: 'Média', range: 30, weight: '6 Kg', level: 75, cls: 'Mago',
      stats: ['Velocidade de conjuração +5%', 'Inteligência +7', 'Constituição +4', 'Chance de crítico +16%'],
    }),
    w('daen-carrasco', 'Carrasco dos Deuses de Aço Fino (Mestre)', {
      bonus: 41, parts: [['cortante', '368-403'], ['fogo', '30']],
      category: 'Espadas', speed: 'Lenta', weight: '15 Kg', level: 66, cls: 'Bárbaro',
      stats: ['Força +6', 'Velocidade de ataque +5%', 'Chance de crítico +32%'],
    }),
    w('daen-projecao', 'Projeção Ígnea de Madeira Endurecida (Mestre)', {
      bonus: 27, parts: [['perfurante', '106-126'], ['fogo', '18-23']],
      category: 'Arcos longos', speed: 'Lenta', range: 30, durability: '186/186', weight: '6 Kg', level: 66, cls: 'Arqueiro',
      stats: ['Destreza +5', 'Velocidade de ataque +5%', 'Chance de crítico +18%'],
    }),
    w('daen-trovao', 'Trovão do Deserto de Aço Fino (Mestre)', {
      bonus: 41, parts: [['perfurante', '108-118'], ['esmagamento', '160-183'], ['fogo', '30']],
      category: 'Maças', speed: 'Lenta', weight: '8 Kg', level: 67, cls: 'Guerreiro',
      stats: ['Força +5', 'Chance de crítico +32%'],
    }),
    w('daen-tormenta', 'Tormenta Desértica de Aço Fino (Mestre)', {
      bonus: 41, parts: [['perfurante', '188-238'], ['fogo', '30']],
      category: 'Lanças', speed: 'Média', range: 2, weight: '8 Kg', level: 67, cls: 'Guerreiro',
      stats: ['Força +5', 'Dano crítico +20%', 'Chance de crítico +32%'],
    }),
  ],
  evendim: [
    w('evendim-veneno', 'Veneno do Rei Lich de Aço Fino (Mestre)', {
bonus: 21, parts: [['gelo', '11-16'], ['eletrico', '51-73']],
      category: 'Cajados', speed: 'Média', range: 30, weight: '6 Kg', level: 73, cls: 'Mago',
      stats: ['Velocidade de conjuração +5%', 'Inteligência +7', 'Vida +50', 'Chance de crítico +16%'],
    }),
    w('evendim-arremetida', 'Arremetida Poderosa de Evendim de Aço Fino (Mestre)', {
bonus: 41, parts: [['esmagamento', '444-508'], ['eletrico', '30']],
      category: 'Martelos', speed: 'Muito lenta', weight: '15 Kg', level: 67, cls: 'Bárbaro',
      stats: ['Força +6', 'Velocidade de ataque +5%', 'Chance de crítico +32%'],
    }),
    w('evendim-garra', 'Garra Inevitável dos Mortos-Vivos de Madeira Endurecida (Mestre)', {
bonus: 27, parts: [['perfurante', '78-98'], ['eletrico', '17-22']],
      category: 'Arcos longos', speed: 'Média', range: 30, durability: '186/186', weight: '6 Kg', level: 66, cls: 'Arqueiro',
      stats: ['Destreza +5', 'Dano crítico +15%', 'Chance de crítico +18%'],
    }),
    w('evendim-carga', 'Carga Poderosa dos Mortos-Vivos de Aço Fino (Mestre)', {
bonus: 41, parts: [['cortante', '285-315'], ['eletrico', '30']],
      category: 'Machados', speed: 'Média', weight: '15 Kg', level: 66, cls: 'Bárbaro',
      stats: ['Constituição +6', 'Velocidade de ataque +5%', 'Chance de crítico +32%'],
    }),
    w('evendim-fio', 'Fio Sombrio dos Mortos-Vivos de Aço Fino (Mestre)', {
bonus: 41, parts: [['cortante', '180-200'], ['esmagamento', '20-30'], ['eletrico', '20']],
      category: 'Espadas', speed: 'Média', weight: '8 Kg', level: 64, cls: 'Guerreiro',
      stats: ['Força +5', 'Chance de crítico +32%'],
    }),
    w('evendim-lasca', 'Lasca Perfuradora dos Mortos-Vivos de Aço Fino (Mestre)', {
bonus: 41, parts: [['perfurante', '180-245'], ['eletrico', '30']],
      category: 'Lanças', speed: 'Média', range: 2, weight: '8 Kg', level: 68, cls: 'Guerreiro',
      stats: ['Força +6', 'Velocidade de ataque +5%', 'Chance de crítico +32%'],
    }),
  ],
  thorkul: [
    w('thorkul-sopro', 'Sopro Desintegrador de Thorkul de Aço Fino (Mestre)', {
      bonus: 21, parts: [['fogo', '11-16'], ['gelo', '52-69']],
      category: 'Cajados', speed: 'Média', range: 30, weight: '6 Kg', level: 72, cls: 'Mago',
      stats: ['Velocidade de conjuração +5%', 'Inteligência +7', 'Velocidade de ataque +5%', 'Chance de crítico +16%'],
    }),
    w('thorkul-mandibula', 'Mandíbula Assassina de Thorkul de Aço Fino (Mestre)', {
      bonus: 41, parts: [['cortante', '368-403'], ['perfurante', '30'], ['gelo', '25']],
      category: 'Espadas', speed: 'Lenta', weight: '15 Kg', level: 71, cls: 'Bárbaro',
      stats: ['Força +5', 'Constituição +3', 'Chance de crítico +32%'],
    }),
    w('thorkul-investida', 'Investida Precisa de Thorkul de Madeira Endurecida (Mestre)', {
      bonus: 27, parts: [['perfurante', '58-74'], ['gelo', '19-24']],
      category: 'Arcos curtos', speed: 'Rápida', range: 25, durability: '186/186', weight: '6 Kg', level: 70, cls: 'Arqueiro',
      stats: ['Destreza +5', 'Alcance de ataque +5%', 'Concentração +5', 'Chance de crítico +18%'],
    }),
    w('thorkul-ponta', 'Ponta Assassina de Thorkul de Aço Fino (Mestre)', {
      bonus: 41, parts: [['perfurante', '358-398'], ['gelo', '30']],
      category: 'Lanças', speed: 'Lenta', range: 2, weight: '15 Kg', level: 67, cls: 'Bárbaro',
      stats: ['Força +6', 'Velocidade de ataque +5%', 'Dano crítico +10%', 'Chance de crítico +32%'],
    }),
    w('thorkul-embestida', 'Embestida de Thorkul de Aço Fino (Mestre)', {
      bonus: 41, parts: [['perfurante', '108-126'], ['esmagamento', '150-185'], ['gelo', '30']],
      category: 'Martelos', speed: 'Lenta', weight: '8 Kg', level: 67, cls: 'Guerreiro',
      stats: ['Força +5', 'Velocidade de ataque +5%', 'Chance de crítico +32%'],
    }),
  ],
}

// ---- Armas antigas ("superior", raridade Mágico) ----
const LORE_DAEN = 'A poderosa magia ígnea imbuída na arma lhe confere um tom avermelhado.'
const LORE_EVE = 'A poderosa magia necromântica imbuída na arma lhe confere um tom esverdeado.'
const LORE_TK = 'As propriedades mágicas desta arma lhe conferem um tom azulado.'
const old = (id, name, lore, o) => w(id, name, { ...o, lore, rarity: 'Mágico', section: 'Antigas' })

const OLD_WEAPONS = {
  daenrha: [
    old('old-daen-tormenta', 'Tormenta Desértica Superior de Aço Fino (Mestre)', LORE_DAEN, {
      bonus: 33, parts: [['cortante', '30'], ['perfurante', '188-238']],
      category: 'Lanças', speed: 'Média', range: 2, durability: '222/222', weight: '8 Kg', level: 66, cls: 'Guerreiro',
      stats: ['Força +5', 'Precisão de golpe +16'],
    }),
    old('old-daen-carrasco', 'Carrasco Superior dos Deuses de Aço Fino (Mestre)', LORE_DAEN, {
      bonus: 33, parts: [['cortante', '368-403'], ['fogo', '30']],
      category: 'Espadas', speed: 'Lenta', durability: '222/222', weight: '15 Kg', level: 66, cls: 'Bárbaro',
      stats: ['Força +6', 'Precisão de golpe +16'],
    }),
    old('old-daen-trovao', 'Trovão Superior do Deserto de Aço Fino (Mestre)', LORE_DAEN, {
      bonus: 33, parts: [['perfurante', '108-118'], ['esmagamento', '160-183'], ['fogo', '30']],
      category: 'Maças', speed: 'Lenta', durability: '189/222', weight: '8 Kg', level: 66, cls: 'Guerreiro',
      stats: ['Força +5', 'Precisão de golpe +16'],
    }),
    old('old-daen-projecao', 'Projeção Ígnea Superior de Madeira Endurecida (Mestre)', LORE_DAEN, {
      bonus: 24, parts: [['perfurante', '106-126'], ['fogo', '18-23']],
      category: 'Arcos longos', speed: 'Lenta', range: 35, durability: '180/186', weight: '6 Kg', level: 66, cls: 'Arqueiro',
      stats: ['Destreza +5', 'Precisão de golpe +9'],
    }),
    old('old-daen-bengala', 'Bengala Executora Superior do Vingador de Aço Fino (Mestre)', LORE_DAEN, {
      bonus: 17, parts: [['fogo', '55-68'], ['eletrico', '11-16']],
      category: 'Cajados', speed: 'Média', range: 30, durability: '222/222', weight: '6 Kg', level: 71, cls: 'Mago',
      stats: ['Inteligência +7', 'Velocidade de conjuração +5%', 'Precisão de golpe +8'],
    }),
  ],
  evendim: [
    old('old-eve-cristal', 'Cristal Perfurador Superior de Evendim de Aço Fino (Mestre)', LORE_EVE, {
      bonus: 33, parts: [['perfurante', '180-245'], ['gelo', '30']],
      category: 'Lanças', speed: 'Média', range: 2, durability: '222/222', weight: '8 Kg', level: 66, cls: 'Guerreiro',
      stats: ['Força +5', 'Precisão de golpe +16'],
    }),
    old('old-eve-carga', 'Carga Poderosa Superior de Evendim de Aço Fino (Mestre)', LORE_EVE, {
      bonus: 33, parts: [['cortante', '285-315'], ['gelo', '30']],
      category: 'Machados', speed: 'Média', durability: '221/222', weight: '15 Kg', level: 66, cls: 'Bárbaro',
      stats: ['Constituição +6', 'Precisão de golpe +16'],
    }),
    old('old-eve-embestida', 'Arremetida Poderosa Superior de Evendim de Aço Fino (Mestre)', LORE_EVE, {
      bonus: 33, parts: [['esmagamento', '444-508'], ['gelo', '30']],
      category: 'Martelos', speed: 'Muito lenta', durability: '222/222', weight: '15 Kg', level: 66, cls: 'Bárbaro',
      stats: ['Força +6', 'Precisão de golpe +16'],
    }),
    old('old-eve-garra', 'Garra Inevitável Superior de Evendim de Madeira Endurecida (Mestre)', LORE_EVE, {
      bonus: 24, parts: [['perfurante', '78-98'], ['gelo', '17-22']],
      category: 'Arcos longos', speed: 'Média', range: 35, durability: '183/186', weight: '6 Kg', level: 66, cls: 'Arqueiro',
      stats: ['Destreza +5', 'Precisão de golpe +9'],
    }),
    old('old-eve-veneno', 'Veneno Superior do Rei Lich de Aço Fino (Mestre)', LORE_EVE, {
      bonus: 17, parts: [['gelo', '11-16'], ['eletrico', '51-73']],
      category: 'Cajados', speed: 'Média', range: 30, durability: '222/222', weight: '6 Kg', level: 72, cls: 'Mago',
      stats: ['Inteligência +7', 'Velocidade de conjuração +5%', 'Precisão de golpe +8'],
    }),
  ],
  thorkul: [
    old('old-tk-pua', 'Ponta Assassina Superior de Thorkul de Aço Fino (Mestre)', LORE_TK, {
      bonus: 33, parts: [['perfurante', '358-398'], ['esmagamento', '30']],
      category: 'Lanças', speed: 'Lenta', range: 2, durability: '200/222', weight: '15 Kg', level: 66, cls: 'Bárbaro',
      stats: ['Força +6', 'Precisão de golpe +16'],
    }),
    old('old-tk-quijada', 'Mandíbula Assassina Superior de Thorkul de Aço Fino (Mestre)', LORE_TK, {
      bonus: 33, parts: [['cortante', '368-403'], ['esmagamento', '30']],
      category: 'Espadas', speed: 'Lenta', durability: '222/222', weight: '15 Kg', level: 65, cls: 'Bárbaro',
      stats: ['Força +5', 'Precisão de golpe +16'],
    }),
    old('old-tk-embestida', 'Embestida Superior de Thorkul de Aço Fino (Mestre)', LORE_TK, {
      bonus: 33, parts: [['cortante', '30'], ['perfurante', '108-126'], ['esmagamento', '150-185']],
      category: 'Martelos', speed: 'Lenta', durability: '221/222', weight: '8 Kg', level: 66, cls: 'Guerreiro',
      stats: ['Força +5', 'Precisão de golpe +16'],
    }),
    old('old-tk-acometida', 'Investida Superior de Thorkul de Madeira Endurecida (Mestre)', LORE_TK, {
      bonus: 24, parts: [['perfurante', '58-74'], ['esmagamento', '19-24']],
      category: 'Arcos curtos', speed: 'Rápida', range: 30, durability: '186/186', weight: '6 Kg', level: 67, cls: 'Arqueiro',
      stats: ['Destreza +5', 'Precisão de golpe +9'],
    }),
    old('old-tk-aliento', 'Sopro Desintegrador Superior de Thorkul de Aço Fino (Mestre)', LORE_TK, {
      bonus: 17, parts: [['fogo', '11-16'], ['gelo', '52-69']],
      category: 'Cajados', speed: 'Média', range: 30, durability: '222/222', weight: '6 Kg', level: 70, cls: 'Mago',
      stats: ['Inteligência +7', 'Velocidade de conjuração +5%', 'Precisão de golpe +8'],
    }),
  ],
}

export const EPIC_WEAPONS = Object.fromEntries(
  Object.keys(NEW_WEAPONS).map((boss) => [boss, [...NEW_WEAPONS[boss], ...(OLD_WEAPONS[boss] ?? [])]]),
)
