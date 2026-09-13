import fs from 'node:fs/promises'
import { ATOS } from '../src/data/atos.js'

const jogo = {
  nome: 'Segurança Digital',
  versao: 1,
  atos: ATOS,
}

await fs.mkdir(
  new URL('../public/data/', import.meta.url),
  { recursive: true },
)

await fs.writeFile(
  new URL('../public/data/game.json', import.meta.url),
  JSON.stringify(jogo, null, 2),
  'utf-8',
)

console.log('✅ public/data/game.json criado.')