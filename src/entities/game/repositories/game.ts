import { prisma } from '@/shared/lib/db'
import {
  GameEntity,
  GameIdleEntity,
  GameInProgressEntity,
  GameOverDrawEntity,
  GameOverEntity,
  PlayerEntity,
} from '../domain'
import { Game, Prisma, User } from '@prisma/client'
import { z } from 'zod'
import { GameStatus } from '@prisma/client'
import { GameId } from '@/kernel/ids'

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

async function startGame(gameId: GameId, player: PlayerEntity) {
  return dbGameToGameEntity(
    await prisma.game.update({
      where: { id: gameId },
      data: {
        players: {
          connect: {
            id: player.id,
          },
        },
        status: 'inProgress',
      },
      include: {
        winner: true,
        players: true,
      },
    }),
  )
}

async function getGame(where?: Prisma.GameWhereInput) {
  const game = await prisma.game.findFirst({
    where,
    include: {
      winner: true,
      players: true,
    },
  })
  if (game) {
    return dbGameToGameEntity(game)
  }
  return undefined
}

async function createGame(game: Omit<GameIdleEntity, 'id'>): Promise<GameEntity> {
  const createdGame = await prisma.game.create({
    data: {
      status: game.status,
      field: game.field,
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
    field: fieldSchema.parse(game.field),
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

export const gameRepository = { gamesList, createGame, getGame, startGame }
