'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AuthRedirectProps {
  user: any
}

export default function AuthRedirect({ user }: AuthRedirectProps) {
  const router = useRouter()

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        console.log('AuthRedirect: Redirecting admin to /admin')
        router.push('/admin')
      } else {
        console.log('AuthRedirect: Redirecting user to /dashboard')
        router.push('/dashboard')
      }
    }
  }, [user, router])

  return null
}
