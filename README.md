# Regnum BR

Contador de respawn dos chefes de Regnum. Cada chefe volta a nascer **61 horas** depois do último spawn.

| Chefe | Reino | Último spawn registrado |
|---|---|---|
| Evendim | Syrtis | 20/11, 17:58 |
| Thorkul | Alsius | 20/11, 04:00 |
| Daen Rha | Ignis | 18/11, 15:12 |

Os horários estão no fuso de Brasília (UTC-3) e ficam definidos em `src/bosses.js`.

## Funcionalidades
- Contagem regressiva ao vivo em cada card, com retrato e cor do reino
- Destaque para o chefe que reaparece primeiro e lista de próximos horários em cada card
- A contagem parte sempre dos horários fixos acima, somando 61 horas a cada ciclo
- Barra de navegação flutuante com as abas Início, Épicos, Crafting e Items
- Aba Items com navegação em lista: Jóias, Armaduras e Armas
- Jóias → Warmaster: joias de cada reino (Alsius, Ignis, Syrtis), dados em `src/joias.js`
- Armaduras e Armas → Champion: peças por classe, dados em `src/champion.js`
- Armaduras → Magnanita: peças por classe com crafting e custo, dados em `src/magnanita.js`
- Armas → Épicos: armas de Daen Rha, Evendim e Thorkul, dados em `src/epicWeapons.js`
- Armas → Chefes: armas de chefes por reino e por chefe, dados em `src/bossWeapons.js`
- Jóias → Épicos: joias de Daen Rha, Evendim e Thorkul, dados em `src/epicJewels.js`
- Jóias → Algaros (Gold): joias compradas com gold, dados em `src/algarosJewels.js`
- Jóias → Halloween: amuletos de Vare Eidahan, dados em `src/halloweenJewels.js`
- Aba Crafting com as receitas (dados em `src/crafting.js`): ao tocar numa receita, abre a probabilidade de êxito, o tempo para craftar e os materiais necessários
- Contador de reset do Xymerald na aba Início (a cada 23 horas, mesma regra do Regnum Warlords, horário de Brasília)
- Mapa de guerra na aba Início (servidor Ra), com dados lidos direto do site oficial championsofregnum.com pela função `api/wz.js` e atualizados a cada minuto
- Layout responsivo para computador e celular

## Como rodar
```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera a pasta dist/
```

Na Vercel, a pasta `api/` vira a função serverless `/api/wz` automaticamente. Em outro servidor estático o mapa continua aparecendo, mas a lista de fortes e gemas depende dessa função.

