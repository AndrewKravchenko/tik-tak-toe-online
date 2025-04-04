import { GameStatus } from '@prisma/client'
import { GameId, UserId } from '@/kernel/ids'

export type GameEntity = GameIdleEntity | GameInProgressEntity | GameOverEntity | GameOverDrawEntity

export type GameIdleEntity = {
  id: GameId
  creator: PlayerEntity
  status: typeof GameStatus.idle
}

export type GameInProgressEntity = {
  id: GameId
  players: PlayerEntity[]
  field: Field
  status: typeof GameStatus.inProgress
}

export type GameOverEntity = {
  id: GameId
  players: PlayerEntity[]
  field: Field
  status: typeof GameStatus.gameOver
  winner: PlayerEntity
}

export type GameOverDrawEntity = {
  id: GameId
  players: PlayerEntity[]
  field: Field
  status: typeof GameStatus.gameOverDraw
}

export type PlayerEntity = {
  id: UserId
  login: string
  rating: number
}

export type Field = (GameSymbol | null)[]
export type GameSymbol = string
