# Regnum Boss Timer

Contador de respawn dos chefes de Regnum. Cada chefe volta a nascer **61 horas** depois do último spawn.

| Chefe | Reino | Último spawn registrado |
|---|---|---|
| Evendim | Syrtis | 20/11, 17:58 |
| Thorkul | Alsius | 20/11, 04:00 |
| Daen Rha | Ignis | 18/11, 15:12 |

Os horários estão no fuso de Brasília (UTC-3) e ficam definidos em `src/bosses.js`.

## Funcionalidades
- Contagem regressiva ao vivo, com anel de progresso do ciclo
- Destaque para o próximo chefe e lista com os próximos spawns
- Botões **Nasceu agora** e **Editar horário**; os horários ficam salvos no navegador
- Alerta opcional no navegador 10 minutos antes do spawn e na hora dele
- Se passar mais de um ciclo sem atualização, os próximos spawns são projetados de 61 em 61 horas
- Layout responsivo para computador e celular

## Como rodar
```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera a pasta dist/ (pode ser hospedada em qualquer servidor estático)
```
