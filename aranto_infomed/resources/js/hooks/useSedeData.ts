import { useState, useEffect } from 'react';
import axios from 'axios';
import {UseSedeDataReturn } from '@/types/sede';
 

const useSedeData = (): UseSedeDataReturn => {
  const [sede, setSede] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({} as Error | null);

  useEffect(() => {
    const fetchSede = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/sedes');
        setSede(response.data);
      } catch (error) {
        console.error('Error fetching sede data:', error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchSede();
  }, []);

  return { sede, loading, error,  };
};

export default useSedeData;