import { useContext } from 'react';
import { AuthContext } from '../contexts/auth-context';

const useAuth = () => {
    const value = useContext(AuthContext);

    return value;
}

export default useAuth;
