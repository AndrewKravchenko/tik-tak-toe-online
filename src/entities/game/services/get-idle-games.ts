import { GameIdleEntity } from '../domain'
import { gameRepository } from '../repositories/game'
import { GameStatus } from '@prisma/client'

export async function getIdleGames(): Promise<GameIdleEntity[]> {
  const games = await gameRepository.gamesList({
    status: GameStatus.idle,
  })

  return games as GameIdleEntity[]
}
