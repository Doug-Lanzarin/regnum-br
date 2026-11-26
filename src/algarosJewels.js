// Jóias de Algaros (compradas com gold), transcritas da imagem da SyrtisBR e traduzidas.

const icon = (id) => `./algaros/${id}.png`
const dano = (type, value) => ({ icon: `./joias/dano/${type}.png`, type, value })

const ANEL = { category: 'Anéis', weight: '5 g', level: 50, price: '3kk' }
const AMULETO = { category: 'Amuletos', weight: '15 g', level: 50, price: '6kk' }

const j = (id, name, base, stats, damage) => ({
  id,
  name,
  icon: icon(id),
  ...base,
  damage,
  stats: stats.map(([text, tone]) => ({ text, tone })),
})
const bad = 'bad'

export const ALGAROS_JEWELS = [
  j('anel-energetico', 'Anel Energético', ANEL, [['Velocidade de conjuração +3%'], ['Mana +75']]),
  j('anel-antigo', 'Anel Antigo', ANEL, [['Dano corpo a corpo recebido -3%', bad], ['Atributo de classe +3']]),
  j('anel-dureza', 'Anel da Dureza', ANEL, [['Dano corpo a corpo recebido -3%', bad], ['Vida +75']]),
  j('anel-rapidez', 'Anel da Rapidez', ANEL, [['Velocidade de conjuração +3%'], ['Dano cortante +12']], dano('cortante', 12)),
  j('anel-cristalino', 'Anel Cristalino', ANEL, [['Dano de gelo +12'], ['Vida +75']], dano('gelo', 12)),
  j('anel-brilhante', 'Anel Brilhante', ANEL, [['Dano esmagador +12'], ['Chance de crítico +15%']], dano('esmagamento', 12)),
  j('amuleto-carmesim', 'Amuleto Carmesim', AMULETO, [['Dano de fogo +20'], ['Vida +100']], dano('fogo', 20)),
  j('amuleto-trevas', 'Amuleto das Trevas', AMULETO, [['Duração de poder +7%'], ['Dano corpo a corpo recebido -5%', bad]]),
  j('amuleto-ceruleo', 'Amuleto Cerúleo', AMULETO, [['Vida +100'], ['Dano à distância recebido -5%', bad]]),
]
