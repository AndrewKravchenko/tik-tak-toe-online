import { useActionState as useActionStateReact } from 'react'

type ActionWithoutPayload<State> = (state: Awaited<State>) => State | Promise<State>
type ActionWithPayload<State, Payload> = (state: Awaited<State>, payload: Payload) => State | Promise<State>

export function useActionState<State, InitialState>(
  action: ActionWithoutPayload<State>,
  initialState: InitialState,
  permalink?: string,
): [state: Awaited<State> | InitialState, dispatch: () => void, isPending: boolean]

export function useActionState<State, InitialState, Payload>(
  action: ActionWithPayload<State, Payload>,
  initialState: InitialState,
  permalink?: string,
): [state: Awaited<State> | InitialState, dispatch: (payload: Payload) => void, isPending: boolean]

export function useActionState<State, InitialState extends Awaited<State>, Payload>(
  action: ActionWithoutPayload<State> | ActionWithPayload<State, Payload>,
  initialState: InitialState,
  permalink?: string,
) {
  return useActionStateReact(action, initialState, permalink)
}
