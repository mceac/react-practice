import { useEffect, useState } from "react";
import "./index.css";
import { getUsers, createUser, updateUser, deleteUser } from "./services/userService";
import type { UserDetailDto } from "./types/user";

function App() {
  const [users, setUsers] = useState<UserDetailDto[]>([]);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [showModal, setShowModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const isEditing = editingUserId !== null;

  // Validación
  const validate = () => {
    const newErrors: { name?: string; email?: string } = {};
    if (!name.trim()) newErrors.name = "El nombre es requerido";
    if (!email.trim()) newErrors.email = "El email es requerido";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Email inválido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Cargar usuarios
  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error cargando usuarios", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const resetForm = () => {
    setName("");
    setEmail("");
    setEditingUserId(null);
    setErrors({});
  };

  const openModalForCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openModalForEdit = (user: UserDetailDto) => {
    setName(user.name);
    setEmail(user.email);
    setEditingUserId(user.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleCreate = async () => {
    try {
      const newUser = await createUser({ name, email });
      setUsers((prev) => [...prev, newUser]);
      closeModal();
    } catch (error) {
      console.error("Error creando usuario", error);
    }
  };

  const handleUpdate = async () => {
    if (editingUserId === null) return;
    try {
      await updateUser(editingUserId, { name, email });
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUserId ? { ...u, name, email } : u))
      );
      closeModal();
    } catch (error) {
      console.error("Error actualizando usuario", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error eliminando usuario", error);
    }
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (isEditing) handleUpdate();
    else handleCreate();
  };

  // Paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Usuarios</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={openModalForCreate}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Crear usuario
        </button>
      </div>

      <ul className="space-y-3 mb-4">
        {currentUsers.map((u) => (
          <li
            key={u.id}
            className="flex justify-between items-center p-3 bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <span className="text-gray-700 font-medium">{u.name}</span>
            <div className="space-x-2 flex">
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center gap-1"
                onClick={() => openModalForEdit(u)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
                Editar
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center gap-1"
                onClick={() => handleDelete(u.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Paginación */}
      <div className="flex justify-center space-x-2 mb-6 flex-wrap gap-1">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded transition ${
              currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>

      {/* MODAL ANIMADO */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-2 transform transition-transform duration-300 ease-out scale-95 animate-scaleIn">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
              {isEditing ? "Editar usuario" : "Crear usuario"}
            </h2>

            <div className="flex flex-col gap-3 mb-4">
              <div>
                <input
                  placeholder="Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`border p-3 rounded w-full focus:outline-none focus:ring-2 ${
                    errors.name ? "focus:ring-red-400 border-red-400" : "focus:ring-blue-400"
                  }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`border p-3 rounded w-full focus:outline-none focus:ring-2 ${
                    errors.email ? "focus:ring-red-400 border-red-400" : "focus:ring-blue-400"
                  }`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                {isEditing ? "Actualizar" : "Crear"}
              </button>
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animaciones Tailwind */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
          .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
        `}
      </style>
    </div>
  );
}

export default App;