import { useEffect, useState } from 'react'
import { getUsers } from '../services/api'
import { User } from '../types/user'

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    getUsers().then(setUsers)
  }, [])

  return { users }
}