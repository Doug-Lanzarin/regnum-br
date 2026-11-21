// Joias Warmaster, transcritas da imagem da SyrtisBR (sem os preços em WMC).
// Textos traduzidos do tooltip do jogo (espanhol) para o português. `tone: 'bad'` marca as linhas vermelhas.

const AMULETO = { category: 'Amuletos', weight: '15 Grms', level: 60 }
const ANILLO = { category: 'Anéis', weight: '5 Grms', level: 60 }

const icon = (id) => `./joias/warmaster/${id}.png`
const dano = (type, value) => ({ icon: `./joias/dano/${type}.png`, type, value })

export const WARMASTER_CASTLES = [
  {
    id: 'eferias',
    label: 'Eferias',
    realm: 'Syrtis',
    color: '#6fd67f',
    items: [
      {
        id: 'amuleto-tormenta',
        name: 'Amuleto da Tempestade',
        ...AMULETO,
        damage: dano('eletrico', 40),
        stats: [{ text: 'Dano de eletricidade +40' }, { text: 'Vida +200' }],
      },
      {
        id: 'amuleto-hechicero-nocturno',
        name: 'Amuleto do Feiticeiro Noturno',
        ...AMULETO,
        damage: dano('eletrico', 40),
        stats: [{ text: 'Dano de eletricidade +40' }, { text: 'Mana +150' }],
      },
      {
        id: 'amuleto-bosque-radiante',
        name: 'Amuleto do Bosque Radiante',
        ...AMULETO,
        stats: [{ text: 'Mana +150' }, { text: 'Velocidade de ataque +10%' }],
      },
      {
        id: 'anillo-mirada-suprema',
        name: 'Anel do Olhar Supremo',
        ...ANILLO,
        damage: dano('perfurante', 25),
        stats: [{ text: 'Dano perfurante +25' }, { text: 'Chance de crítico +30%' }],
      },
      {
        id: 'anillo-alma-elevada',
        name: 'Anel da Alma Elevada',
        ...ANILLO,
        damage: dano('cortante', 25),
        stats: [{ text: 'Dano cortante +25' }, { text: 'Velocidade de conjuração +7%' }],
      },
      {
        id: 'anillo-piel-arborea',
        name: 'Anel da Pele Arbórea',
        ...ANILLO,
        stats: [{ text: 'Vida +125' }, { text: 'Dano corpo a corpo recebido -7%', tone: 'bad' }],
      },
    ],
  },
  {
    id: 'shanarid',
    label: 'Shanarid',
    realm: 'Ignis',
    color: '#ff8a50',
    items: [
      {
        id: 'amuleto-sangre-hirviente',
        name: 'Amuleto do Sangue Fervente',
        ...AMULETO,
        damage: dano('fogo', 40),
        stats: [{ text: 'Dano de fogo +40' }, { text: 'Vida +200' }],
      },
      {
        id: 'amuleto-lumbre-rauda',
        name: 'Amuleto da Chama Veloz',
        ...AMULETO,
        damage: dano('fogo', 40),
        stats: [{ text: 'Dano de fogo +40' }, { text: 'Velocidade de conjuração +10%' }],
      },
      {
        id: 'amuleto-furia-sultar',
        name: 'Amuleto da Fúria de Sultar',
        ...AMULETO,
        stats: [{ text: 'Dano corpo a corpo recebido -10%', tone: 'bad' }, { text: 'Duração de poder +15%' }],
      },
      {
        id: 'anillo-mirada-destructiva',
        name: 'Anel do Olhar Destrutivo',
        ...ANILLO,
        damage: dano('esmagamento', 25),
        stats: [{ text: 'Dano esmagador +25' }, { text: 'Chance de crítico +30%' }],
      },
      {
        id: 'anillo-vinculo-matriarca',
        name: 'Anel do Vínculo Matriarca',
        ...ANILLO,
        damage: dano('perfurante', 25),
        stats: [{ text: 'Dano perfurante +25' }, { text: 'Bônus de cura +7%' }],
      },
      {
        id: 'anillo-presteza-magica',
        name: 'Anel da Presteza Mágica',
        ...ANILLO,
        stats: [{ text: 'Velocidade de conjuração +5%' }, { text: 'Mana +100' }],
      },
    ],
  },
  {
    id: 'imperia',
    label: 'Imperia',
    realm: 'Alsius',
    color: '#7cb8f0',
    items: [
      {
        id: 'amuleto-piel-helada',
        name: 'Amuleto da Pele Gelada',
        ...AMULETO,
        damage: dano('gelo', 40),
        stats: [{ text: 'Dano de gelo +40' }, { text: 'Vida +200' }],
      },
      {
        id: 'amuleto-fulgor-niveo',
        name: 'Amuleto do Fulgor Níveo',
        ...AMULETO,
        damage: dano('gelo', 40),
        stats: [{ text: 'Dano de gelo +40' }, { text: 'Dano à distância recebido -10%', tone: 'bad' }],
      },
      {
        id: 'amuleto-fusion-gelida',
        name: 'Amuleto da Fusão Gélida',
        ...AMULETO,
        stats: [{ text: 'Vida +200' }, { text: 'Dano à distância recebido -10%', tone: 'bad' }],
      },
      {
        id: 'anillo-fortaleza',
        name: 'Anel da Fortaleza',
        ...ANILLO,
        damage: dano('esmagamento', 25),
        stats: [{ text: 'Dano esmagador +25' }, { text: 'Força +8' }],
      },
      {
        id: 'anillo-vinculo-sanguineo',
        name: 'Anel do Vínculo Sanguíneo',
        ...ANILLO,
        damage: dano('cortante', 25),
        stats: [{ text: 'Dano cortante +25' }, { text: 'Bônus de cura +7%' }],
      },
      {
        id: 'anillo-experto',
        name: 'Anel do Especialista',
        ...ANILLO,
        stats: [{ text: 'Dano corpo a corpo recebido -5%', tone: 'bad' }, { text: 'Atributo de classe +7' }],
      },
    ],
  },
].map((castle) => ({ ...castle, items: castle.items.map((it) => ({ ...it, icon: icon(it.id) })) }))
