import { GameStatus } from '@prisma/client'

export type GameEntity = GameIdleEntity | GameInProgressEntity | GameOverEntity | GameOverDrawEntity

export type GameIdleEntity = {
  id: string
  creator: PlayerEntity
  status: typeof GameStatus.idle
}

export type GameInProgressEntity = {
  id: string
  players: PlayerEntity[]
  field: Field
  status: typeof GameStatus.inProgress
}

export type GameOverEntity = {
  id: string
  players: PlayerEntity[]
  field: Field
  status: typeof GameStatus.gameOver
  winner: PlayerEntity
}

export type GameOverDrawEntity = {
  id: string
  players: PlayerEntity[]
  field: Field
  status: typeof GameStatus.gameOverDraw
}

export type PlayerEntity = {
  id: string
  login: string
  rating: number
}

export type Field = (GameSymbol | null)[]
export type GameSymbol = string
