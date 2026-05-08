import { useEffect, useState } from "react";
import { getUsers } from "../api/userService";
import type { UserDetailDto } from "../types/user";

export function useUsers() {
  const [users, setUsers] = useState<UserDetailDto[]>([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  return { users };
}
