const ENDPOINT = 'https://order2party.pt/graphql'

export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  })
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data as T
}
