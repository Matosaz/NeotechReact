import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🚀 Carregar usuário salvo no localStorage ao iniciar (verificar se está no cliente)
  useEffect(() => {
    if (typeof window !== "undefined") { // Verifica se o código está sendo executado no cliente
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser)); // Tenta converter string JSON de volta para objeto
        } catch (error) {
          console.error("Erro ao carregar usuário do localStorage:", error);
          localStorage.removeItem("user"); // Remove item corrompido, se houver
        }
      }
    }
  }, []);

  // 🚀 Atualiza o localStorage sempre que o user mudar (verificar se está no cliente)
  useEffect(() => {
    if (typeof window !== "undefined") { // Verifica se o código está sendo executado no cliente
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user"); // Remove se o user for null (logout)
      }
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
