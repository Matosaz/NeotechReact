import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  console.log(children); // Verificar o que está sendo passado como children

  const [user, setUser] = useState(null);

  // 🚀 Carregar usuário salvo no localStorage ao iniciar (verificar se está no cliente)
  useEffect(() => {
    if (typeof window !== "undefined") { 
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser && typeof parsedUser === 'object') {
            setUser(parsedUser);
          } else {
            console.error("Formato de usuário inválido");
            localStorage.removeItem("user");
          }
        } catch (error) {
          console.error("Erro ao carregar usuário do localStorage:", error);
          localStorage.removeItem("user");
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
