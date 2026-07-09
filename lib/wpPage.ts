import { fetchGraphQL } from './graphql'

export type WPPage = { title: string; content: string }

const PAGE_QUERY = `
  query WPPage($uri: ID!) {
    page(id: $uri, idType: URI) {
      title
      content(format: RENDERED)
    }
  }
`

export async function fetchWPPage(uri: string): Promise<WPPage | null> {
  const data = await fetchGraphQL<{ page: WPPage | null }>(PAGE_QUERY, { uri })
  if (!data.page) return null
  return { title: data.page.title.replace(/ /g, ' ').trim(), content: data.page.content }
}
