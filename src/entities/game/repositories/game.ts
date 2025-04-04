import { prisma } from '@/shared/lib/db'
import { GameEntity, GameIdleEntity, GameInProgressEntity, GameOverDrawEntity, GameOverEntity } from '../domain'
import { Game, Prisma, User } from '@prisma/client'
import { z } from 'zod'
import { GameStatus } from '@prisma/client'

type GameWithPlayersAndWinner = Game & {
  players: Omit<User, 'passwordHash'>[]
  winner?: Omit<User, 'passwordHash'> | null
}

async function gamesList(where?: Prisma.GameWhereInput): Promise<GameEntity[]> {
  const games = await prisma.game.findMany({
    where,
    include: {
      winner: true,
      players: {
        omit: {
          passwordHash: true,
        },
      },
    },
  })

  return games.map(dbGameToGameEntity)
}

async function createGame(game: Omit<GameIdleEntity, 'id'>): Promise<GameEntity> {
  const createdGame = await prisma.game.create({
    data: {
      status: game.status,
      field: Array(9).fill(null),
      players: {
        connect: { id: game.creator.id },
      },
    },
    include: {
      winner: true,
      players: {
        omit: {
          passwordHash: true,
        },
      },
    },
  })

  return dbGameToGameEntity(createdGame)
}

const fieldSchema = z.array(z.union([z.string(), z.null()]))

function dbGameToGameEntity(game: GameWithPlayersAndWinner): GameEntity {
  switch (game.status) {
    case GameStatus.idle:
      return mapIdleGame(game)
    case GameStatus.inProgress:
    case GameStatus.gameOverDraw:
      return mapInProgressGame(game)
    case GameStatus.gameOver: {
      return mapGameOverGame(game)
    }
  }
}

function mapIdleGame(game: GameWithPlayersAndWinner): GameIdleEntity {
  const [creator] = game.players
  if (!creator) {
    throw new Error('Idle game must have a creator')
  }
  return {
    id: game.id,
    creator,
    status: game.status,
  } as GameIdleEntity
}

function mapInProgressGame(game: GameWithPlayersAndWinner): GameInProgressEntity | GameOverDrawEntity {
  return {
    id: game.id,
    players: game.players,
    status: game.status,
    field: fieldSchema.parse(game.field),
  } as GameInProgressEntity | GameOverDrawEntity
}

function mapGameOverGame(game: GameWithPlayersAndWinner): GameOverEntity {
  if (!game.winner) {
    throw new Error('Game over must have a winner')
  }
  return {
    id: game.id,
    players: game.players,
    status: game.status,
    field: fieldSchema.parse(game.field),
    winner: game.winner,
  } as GameOverEntity
}

export const gameRepository = { gamesList, createGame }
