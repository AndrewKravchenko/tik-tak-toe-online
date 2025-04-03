import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";

export function GameCard({ login, rating }: { login: string; rating: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Game with {login}</CardTitle>
      </CardHeader>
      <CardContent>Rating: {rating}</CardContent>
    </Card>
  );
}
