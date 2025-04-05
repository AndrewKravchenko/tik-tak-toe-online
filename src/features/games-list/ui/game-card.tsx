import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/shared/ui/card'
import React from 'react'

export function GameCard({ login, rating, actions }: { login: string; rating: number; actions: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Game with {login}</CardTitle>
      </CardHeader>
      <CardContent>Rating: {rating}</CardContent>
      <CardFooter>{actions}</CardFooter>
    </Card>
  )
}
