// Joias Warmaster, transcritas da imagem da SyrtisBR (sem os preços em WMC).
// Os textos seguem o tooltip do jogo. `tone: 'bad'` marca as linhas vermelhas.

const AMULETO = { category: 'Amuletos', weight: '15 Grms', level: 60 }
const ANILLO = { category: 'Anillos', weight: '5 Grms', level: 60 }

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
        name: 'Amuleto de la Tormenta',
        ...AMULETO,
        damage: dano('eletrico', 40),
        stats: [{ text: 'Daño de electricidad +40' }, { text: 'Salud +200' }],
      },
      {
        id: 'amuleto-hechicero-nocturno',
        name: 'Amuleto del Hechicero Nocturno',
        ...AMULETO,
        damage: dano('eletrico', 40),
        stats: [{ text: 'Daño de electricidad +40' }, { text: 'Mana +150' }],
      },
      {
        id: 'amuleto-bosque-radiante',
        name: 'Amuleto del Bosque Radiante',
        ...AMULETO,
        stats: [{ text: 'Mana +150' }, { text: 'Velocidad de ataque +10%' }],
      },
      {
        id: 'anillo-mirada-suprema',
        name: 'Anillo de la Mirada Suprema',
        ...ANILLO,
        damage: dano('perfurante', 25),
        stats: [{ text: 'Daño punzante +25' }, { text: 'Chance de crítico +30%' }],
      },
      {
        id: 'anillo-alma-elevada',
        name: 'Anillo del Alma Elevada',
        ...ANILLO,
        damage: dano('cortante', 25),
        stats: [{ text: 'Daño cortante +25' }, { text: 'Velocidad de invocación +7%' }],
      },
      {
        id: 'anillo-piel-arborea',
        name: 'Anillo de la Piel Arbórea',
        ...ANILLO,
        stats: [{ text: 'Salud +125' }, { text: 'Daño melee recibido -7%', tone: 'bad' }],
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
        name: 'Amuleto de la Sangre Hirviente',
        ...AMULETO,
        damage: dano('fogo', 40),
        stats: [{ text: 'Daño de fuego +40' }, { text: 'Salud +200' }],
      },
      {
        id: 'amuleto-lumbre-rauda',
        name: 'Amuleto de la Lumbre Rauda',
        ...AMULETO,
        damage: dano('fogo', 40),
        stats: [{ text: 'Daño de fuego +40' }, { text: 'Velocidad de invocación +10%' }],
      },
      {
        id: 'amuleto-furia-sultar',
        name: 'Amuleto de la Furia de Sultar',
        ...AMULETO,
        stats: [{ text: 'Daño melee recibido -10%', tone: 'bad' }, { text: 'Duración de poder +15%' }],
      },
      {
        id: 'anillo-mirada-destructiva',
        name: 'Anillo de la Mirada Destructiva',
        ...ANILLO,
        damage: dano('esmagamento', 25),
        stats: [{ text: 'Daño aplastante +25' }, { text: 'Chance de crítico +30%' }],
      },
      {
        id: 'anillo-vinculo-matriarca',
        name: 'Anillo del Vínculo Matriarca',
        ...ANILLO,
        damage: dano('perfurante', 25),
        stats: [{ text: 'Daño punzante +25' }, { text: 'Bonus de Curación +7%' }],
      },
      {
        id: 'anillo-presteza-magica',
        name: 'Anillo de la Presteza Mágica',
        ...ANILLO,
        stats: [{ text: 'Velocidad de invocación +5%' }, { text: 'Mana +100' }],
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
        name: 'Amuleto de la Piel Helada',
        ...AMULETO,
        damage: dano('gelo', 40),
        stats: [{ text: 'Daño de hielo +40' }, { text: 'Salud +200' }],
      },
      {
        id: 'amuleto-fulgor-niveo',
        name: 'Amuleto del Fulgor Níveo',
        ...AMULETO,
        damage: dano('gelo', 40),
        stats: [{ text: 'Daño de hielo +40' }, { text: 'Daño de rango recibido -10%', tone: 'bad' }],
      },
      {
        id: 'amuleto-fusion-gelida',
        name: 'Amuleto de la Fusión Gélida',
        ...AMULETO,
        stats: [{ text: 'Salud +200' }, { text: 'Daño de rango recibido -10%', tone: 'bad' }],
      },
      {
        id: 'anillo-fortaleza',
        name: 'Anillo de la Fortaleza',
        ...ANILLO,
        damage: dano('esmagamento', 25),
        stats: [{ text: 'Daño aplastante +25' }, { text: 'Fuerza +8' }],
      },
      {
        id: 'anillo-vinculo-sanguineo',
        name: 'Anillo del Vínculo Sanguíneo',
        ...ANILLO,
        damage: dano('cortante', 25),
        stats: [{ text: 'Daño cortante +25' }, { text: 'Bonus de Curación +7%' }],
      },
      {
        id: 'anillo-experto',
        name: 'Anillo del Experto',
        ...ANILLO,
        stats: [{ text: 'Daño melee recibido -5%', tone: 'bad' }, { text: 'Atributo de clase +7' }],
      },
    ],
  },
].map((castle) => ({ ...castle, items: castle.items.map((it) => ({ ...it, icon: icon(it.id) })) }))
