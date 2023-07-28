import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'

export default function usePath() {
  const defaultPath = '/';
  const [isMounted, setIsMounted] = useState(false);
  const router =  useRouter();
  const [currentPath, setCurrentPath] = useState(defaultPath);
  
  // Establecer isMounted a true cuando se monta el componente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (router) {
      const handleRouteChange = (url:any) => {
        setCurrentPath(url);
      }
      // Cuando la ruta cambia, llama a handleRouteChange
      // Limpia el listener al desmontar el componente
      return () => {
      }
    }
  }, [router]); // Agregar router como dependencia
  return { currentPath };
}
