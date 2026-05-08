const API_URL = `${import.meta.env.VITE_API_URL}/Users`;

export const getUsers = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Error al obtener usuarios");
  }

  return response.json();
};

export const createUser = async (user: { name: string; email: string }) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Error al crear usuario");
  }

  return response.json();
};

export const updateUser = async (
  id: number,
  user: { name: string; email: string } ) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar usuario");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export const deleteUser = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar usuario");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};
