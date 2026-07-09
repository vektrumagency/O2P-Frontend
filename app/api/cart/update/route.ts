import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const cookies = req.headers.get('cookie') ?? ''

  const cartRes = await fetch('https://order2party.pt/wp-json/wc/store/v1/cart', {
    headers: { cookie: cookies },
  })
  const nonce = cartRes.headers.get('Nonce') ?? ''
  const cartCookies = cartRes.headers.getSetCookie()

  const res = await fetch('https://order2party.pt/wp-json/wc/store/v1/cart/update-item', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Nonce: nonce,
      cookie: cookies,
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  const response = NextResponse.json(data, { status: res.status })

  for (const c of [...cartCookies, ...res.headers.getSetCookie()]) {
    response.headers.append('Set-Cookie', c)
  }

  return response
}
