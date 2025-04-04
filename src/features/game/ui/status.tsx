import { GameDomain } from '@/entities/game'

export function GameStatus({ game }: { game: GameDomain.GameEntity }) {
  switch (game.status) {
    case 'idle':
      return <div className="text-lg">Waiting for the player</div>
    case 'inProgress': {
      const currentSymbol = GameDomain.getGameCurrentStep(game)
      return <div className="text-lg">Motion: {currentSymbol}</div>
    }
    case 'gameOver':
      const currentSymbol = GameDomain.getGameCurrentStep(game)
      return <div className="text-lg">Winner: {currentSymbol}</div>
    case 'gameOverDraw':
      return <div className="text-lg">Draw</div>
  }
}
