import { left, right } from '@/shared/lib/either'
import { PlayerEntity } from '../domain'
import { gameRepository } from '../repositories/game'
import { GameStatus } from '@prisma/client'

export async function createGame(player: PlayerEntity) {
  const playerGames = await gameRepository.gamesList({
    players: { some: { id: player.id } },
    status: 'idle',
  })

  const isGameInIdleStatus = playerGames.some(
    (game) => game.status === GameStatus.idle && game.creator.id === player.id,
  )

  if (isGameInIdleStatus) {
    return left('can-create-only-one-game' as const)
  }

  const createdGame = await gameRepository.createGame({
    creator: player,
    status: 'idle',
    field: Array(9).fill(null),
  })

  return right(createdGame)
}
