export async function buscarJogo() {
  const response = await fetch('/data/game.json')

  if (!response.ok) {
    throw new Error(
      `Erro ao carregar jogo: ${response.status}`,
    )
  }

  const dados = await response.json()

  if (!dados?.atos) {
    throw new Error(
      'Arquivo game.json inválido.',
    )
  }

  return dados
}