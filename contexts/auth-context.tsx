"use client";

import { createContext, useEffect, useState } from 'react';

import { RoleEnum, RoleType } from '@/@types/role';
import ApiService from '@/services/api';
import URLS from '@/services/urls';
import { useRouter } from 'next/navigation';

export interface Auth {
    access_token: string;

    id: number;
    brand_id: number;
    branch_id?: number;
    role: RoleType;
}

export interface AuthContextType {
    auth?: Auth;
    setAuth: (access_token: string) => void;

    isLoading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;

    refreshAuth: () => void;
}

interface AuthContextProviderProps {
    children: React.ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

const AuthContextProvider = ({ children, ...props }: AuthContextProviderProps) => {
    const router = useRouter();

    const [auth, _setAuth] = useState<Auth>();
    const [isLoading, setLoading] = useState(true);

    const setAuth = (access_token?: string) => {
        if (!access_token) {
            _setAuth(undefined);
            return;
        }

        const [, payload] = access_token.split(".");
        const user: Auth = JSON.parse(atob(payload));

        _setAuth({
            access_token: access_token,

            id: user.id,
            brand_id: user.brand_id,
            branch_id: user.branch_id,
            role: user.role
        });
    };

    const refreshAuth = () => {
        setLoading(true)

        ApiService.post(URLS.AUTH.REFRESH, {}).then((res: { data: { access_token: string } }) => {
            setAuth(res.data.access_token);
            setLoading(false);
        }).catch(() => {
            setAuth(undefined);
            setLoading(false);
        });
    }

    useEffect(() => refreshAuth(), []);

    useEffect(() => {
        if (auth?.access_token) {
            switch (auth.role) {
                case RoleEnum.EMPLOYEE:
                    router.push("/employee/dashboard");
                    break;
                case RoleEnum.MANAGER:
                    router.push("/manager/dashboard")
                    break;
                case RoleEnum.ADMIN:
                    router.push("/admin/dashboard")
                    break;
                default:
                    setAuth(undefined);
                    break;
            }
        }
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth, isLoading, setLoading, refreshAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider