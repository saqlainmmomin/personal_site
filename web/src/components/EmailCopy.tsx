import { useRef, useState } from 'react'

export function EmailCopy({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>(undefined)

  async function copy() {
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      const area = document.createElement('textarea')
      area.value = email
      document.body.append(area)
      area.select()
      document.execCommand('copy')
      area.remove()
    }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <span className="inline-flex flex-wrap items-baseline gap-xs">
      <a href={`mailto:${email}`}>{email}</a>
      <button
        type="button"
        onClick={copy}
        data-copy-email
        className="label cursor-pointer rounded-sm border border-line px-xs py-0.5 text-grey hover:border-ink hover:text-ink"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <span role="status" className="sr-only">
        {copied ? 'Email address copied' : ''}
      </span>
    </span>
  )
}
