import Link from 'next/link'

interface PinkLinkProps {
  href: string
  children: React.ReactNode
}

export function PinkLink({ href, children }: PinkLinkProps) {
  return (
    <Link 
      href={href} 
      className="no-underline font-bold hover:underline"
      style={{ color: '#E55E99' }}
    >
      {children}
    </Link>
  )
}