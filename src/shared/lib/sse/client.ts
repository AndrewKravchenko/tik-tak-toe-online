import { useState, useEffect } from 'react'

export function useEventsSource<T>(url: string) {
  const [isPending, setIsPending] = useState(true)
  const [dataStream, setDataStream] = useState<T>()
  const [error, setError] = useState<unknown | undefined>()

  useEffect(() => {
    const gameEvents = new EventSource(url)

    gameEvents.addEventListener('message', (message) => {
      try {
        setIsPending(false)
        setError(undefined)
        setDataStream(JSON.parse(message.data))
      } catch (e) {
        setError(e)
      }
    })

    gameEvents.addEventListener('error', (e) => {
      setError(e)
    })

    return () => gameEvents.close()
  }, [url])

  return {
    dataStream,
    error,
    isPending,
  }
}
