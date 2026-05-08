import { useUsers } from '../hooks/useUsers'

export default function Home() {
  const { users } = useUsers()

  return (
    <div>
      <h1>Usuarios</h1>
      {users.map(u => (
        <p key={u.id}>{u.name}</p>
      ))}
    </div>
  )
}