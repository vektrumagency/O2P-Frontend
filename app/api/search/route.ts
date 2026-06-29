import { NextRequest, NextResponse } from 'next/server'

const QUERY = `
  query SearchProducts($search: String!, $limit: Int!) {
    products(first: $limit, where: { search: $search, status: "publish" }) {
      nodes {
        name
        slug
        image { sourceUrl altText }
        ... on SimpleProduct { price regularPrice }
        ... on VariableProduct { price regularPrice }
      }
    }
  }
`

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? ''
  const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '8', 10)
  if (!q.trim()) return NextResponse.json([])

  try {
    const res = await fetch('https://order2party.pt/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY, variables: { search: q, limit } }),
    })

    const json = await res.json()
    const nodes = json?.data?.products?.nodes ?? []
    return NextResponse.json(nodes)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}
