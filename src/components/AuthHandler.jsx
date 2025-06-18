import { useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';

// Componente para tratar erros de autenticação globalmente
const AuthHandler = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Função para verificar se o token está expirado
  const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
      // Decodificar o token JWT (parte do payload)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      // Verificar se o token expirou
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error("Erro ao verificar token:", error);
      return true; // Em caso de erro, considerar o token como expirado
    }
  };

  useEffect(() => {
    // Verificar token ao iniciar
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      // Token expirado, fazer logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/Auth');
    }

    // Interceptar todas as requisições fetch
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        // Verificar se é uma requisição de login para não interceptar
        const url = args[0]?.toString() || '';
        
        // NUNCA interceptar requisições de login ou cadastro
        if (url.includes('/login') || url.includes('/api/v1/users') && args[1]?.method === 'POST') {
          return await originalFetch(...args);
        }
        
        // Para todas as outras requisições, verificar se precisa de autenticação
        if (url.includes('/api/v1/users') && !url.includes('/check-email')) {
          const token = localStorage.getItem('token');
          
          // Se não tiver token e a requisição precisar de autenticação
          if (!token) {
            navigate('/Auth');
            throw new Error('Token não encontrado. Faça login novamente.');
          }
          
          // Se o token estiver expirado
          if (isTokenExpired(token)) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            navigate('/Auth?expired=true');
            throw new Error('Sessão expirada. Por favor, faça login novamente.');
          }
        }
        
        const response = await originalFetch(...args);
        
        // Tratar erro 401 apenas para requisições autenticadas
        // e que não sejam de login/cadastro
        if (response.status === 401 && 
            !url.includes('/login') && 
            !url.includes('/api/v1/users') && 
            args[1]?.method !== 'POST') {
          
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          navigate('/Auth?expired=true');
        }
        
        return response;
      } catch (error) {
        throw error;
      }
    };

    // Cleanup function
    return () => {
      window.fetch = originalFetch;
    };
  }, [setUser, navigate]);

  return null; // Este componente não renderiza nada
};

export default AuthHandler;