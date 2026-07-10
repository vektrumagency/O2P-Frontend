'use client'

import { useState, type CSSProperties, type FormEvent } from 'react'

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '14px',
  border: '1.5px solid rgba(0,0,0,0.15)',
  fontFamily: 'var(--font-fraktion-sans)',
  fontSize: 'var(--text-base)',
  backgroundColor: '#fff',
}

const labelStyle: CSSProperties = {
  display: 'block',
  marginBottom: '6px',
  fontFamily: 'var(--font-fraktion-sans)',
  fontWeight: 700,
  fontSize: 'var(--text-2xs)',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  opacity: 0.45,
}

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const subject = encodeURIComponent(`Contacto via site — ${name || 'Cliente'}`)
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`)
    window.location.href = `mailto:geral@order2party.pt?subject=${subject}&body=${body}`
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label style={labelStyle}>O seu nome</label>
        <input required style={inputStyle} value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div>
        <label style={labelStyle}>O seu e-mail</label>
        <input required type="email" style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <label style={labelStyle}>Mensagem</label>
        <textarea required rows={5} style={{ ...inputStyle, resize: 'vertical' }} value={message} onChange={e => setMessage(e.target.value)} />
      </div>
      <button
        type="submit"
        className="hover:opacity-80 transition-opacity"
        style={{
          alignSelf: 'flex-start',
          fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: 'var(--text-md)',
          padding: '13px 28px', borderRadius: '999px',
          backgroundColor: '#0a0a0a', color: '#FFE394',
          border: 'none', cursor: 'pointer',
        }}
      >
        Enviar mensagem →
      </button>
    </form>
  )
}
