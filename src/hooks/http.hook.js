import { useState, useCallback } from "react";

const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (url, 
        method = "GET", 
        body = null, 
        headers = {'Contetnt-Type': 'application/json'}) => {
            setLoading(true);

            try {
                const responce = await fetch(url)
                
                if (!responce.ok) {
                    throw new Error(`Error on ${url}`)
                }
                
                const data = await responce.json();
                
                setLoading(false);
                return data;                
            } catch(e) {
                console.log(e)
                setLoading(false);
                setError(e.message);

                throw e;
            }
    }, [])

    const clearError = useCallback(() => setError(null), []);

    return {loading, error, request, clearError};
}

export default useHttp