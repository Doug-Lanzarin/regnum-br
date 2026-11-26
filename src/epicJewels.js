// Jóias dos épicos, transcritas dos prints do jogo e traduzidas.

const icon = (id) => `./epicos/${id}.png`

const W = './magnanita/moeda-w.png'
const m = (id, name, qty) => ({ id, name, qty, icon: `./epicos/mat/${id}.png` })
const craft = (chance, time, level, materials, cost) => ({ chance, time, level, materials, costs: [{ coin: W, value: cost }] })
const dano = (type, value) => ({ icon: `./joias/dano/${type}.png`, type, value })

const ANEL = { category: 'Anéis', weight: '5 g' }
const AMULETO = { category: 'Amuletos', weight: '20 g' }

const j = (id, name, base, o) => ({
  id,
  name,
  icon: icon(id),
  ...base,
  level: 50,
  itemLevel: o.itemLevel,
  damage: o.damage,
  lore: o.lore,
  stats: o.stats.map((text) => ({ text })),
  craft: o.craft,
  epic: true,
})

const JEWELS = {
  daenrha: [
    j('daen-anel-furia', 'Anel da Fúria Ígnea', ANEL, {
      craft: craft(80, 7200, 9, [
        m('encantamento', 'Encantamento', 20),
        m('faja-ritualistica-daen', 'Faixa ritualística de Da…', 45),
        m('fragmento-escudo-daen', 'Fragmento de escudo de …', 300),
        m('essencia-hirviente-daen', 'Essência fervente de Da…', 2),
        m('lingote-aco-fino', 'Lingote de aço fino', 5),
        m('tecidos-antigos-daen', 'Tecidos antigos de Dae…', 100),
        m('runa-invocacao-daen', 'Runa de invocação de D…', 6),
      ], 250000),
      itemLevel: 50, damage: dano('fogo', 34),
      lore: 'Este anel canaliza a fúria contida em anos de guerra e vingança.',
      stats: ['Dano de fogo +34', 'Força +6'],
    }),
    j('daen-anel-nomade', 'Anel do Nômade', ANEL, {
      itemLevel: 50,
      stats: ['Concentração +6', 'Chance de crítico +34%'],
    }),
    j('daen-amuleto-sol', 'Amuleto do Filho do Sol', AMULETO, {
      itemLevel: 149,
      lore: 'Este amuleto contém todo o fogo vital da alma de Daen Rha.',
      stats: ['Destreza +10', 'Vida +250'],
    }),
  ],
  thorkul: [
    j('tk-anel-acometida', 'Anel da Investida Poderosa', ANEL, {
      craft: craft(80, 7200, 9, [
        m('encantamento', 'Encantamento', 20),
        m('presa-afiada-thorkul', 'Presa afiada de Tho…', 45),
        m('pele-grossa-thorkul', 'Pele grossa de Thorkul', 300),
        m('essencia-putrida-thorkul', 'Essência pútrida de Thorkul', 2),
        m('lingote-aco-fino', 'Lingote de aço fino', 5),
        m('ponta-pua-thorkul', 'Ponta de espinho de Thorkul', 100),
        m('musculo-coracao-thorkul', 'Músculo de coração de T…', 6),
      ], 250000),
      itemLevel: 132, damage: dano('gelo', 34),
      lore: 'Uma carga de energia e força percorre o corpo ao fazer contato com este anel.',
      stats: ['Mana +175', 'Dano de gelo +34'],
    }),
    j('tk-anel-terra', 'Anel da Terra', ANEL, {
      itemLevel: 50,
      lore: 'Este anel consegue uma comunhão especial com a terra, canalizando suas propriedades.',
      stats: ['Concentração +6', 'Chance de crítico +34%'],
    }),
    j('tk-amuleto-pele', 'Pele Pétrea de Thorkul', AMULETO, {
      itemLevel: 149,
      lore: 'Este amuleto confere o poder e a resistência naturais de Thorkul.',
      stats: ['Vida +250', 'Força +10'],
    }),
  ],
  evendim: [
    j('eve-anel-toque', 'Anel do Toque Putrefato', ANEL, {
      craft: craft(80, 7200, 9, [
        m('encantamento', 'Encantamento', 20),
        m('osso-espectral-evendim', 'Osso espectral de Evendim', 45),
        m('fragmento-armadura-evendim', 'Fragmento de armadura d…', 300),
        m('essencia-magica-evendim', 'Essência mágica de Evendim', 2),
        m('lingote-aco-fino', 'Lingote de aço fino', 5),
        m('farrapos-evendim', 'Farrapos inscritos de Ev…', 100),
        m('gema-antiga-evendim', 'Gema antiga de Evendim', 6),
      ], 250000),
      itemLevel: 50, damage: dano('eletrico', 34),
      lore: 'O halo gelado deste anel lembra o frio roçar de uma mão sem vida.',
      stats: ['Dano elétrico +34', 'Chance de crítico +34%'],
    }),
    j('eve-anel-energia', 'Anel da Energia Assombrosa', ANEL, {
      itemLevel: 139,
      lore: 'Uma carga de energia magnética percorre o corpo ao fazer contato com este anel.',
      stats: ['Mana +175', 'Concentração +6'],
    }),
    j('eve-amuleto-essencia', 'Amuleto da Essência Espiritual', AMULETO, {
      itemLevel: 149,
      lore: 'Este amuleto contém toda a vitalidade sobrenatural da alma eterna de Evendim.',
      stats: ['Vida +250', 'Inteligência +10'],
    }),
  ],
}

// Todas as joias de um mesmo épico usam a mesma receita (a do anel que tem receita no print)
export const EPIC_JEWELS = Object.fromEntries(
  Object.entries(JEWELS).map(([boss, list]) => {
    const recipe = list.find((x) => x.craft)?.craft
    return [boss, list.map((x) => ({ ...x, craft: x.craft ?? recipe }))]
  }),
)
