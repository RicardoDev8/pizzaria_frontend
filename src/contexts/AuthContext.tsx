import { createContext, ReactNode, useState, useEffect } from 'react'

import { api } from '../services/apiClient'

import { destroyCookie, setCookie, parseCookies } from 'nookies'
import Router from 'next/router'

import { toast } from 'react-toastify'

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut(){
    try{
        destroyCookie(undefined, '@nextauth.token')
        Router.push('/')
        toast.info('Você saiu',{
            theme:'dark'
        })
    }catch{
        console.log('erro ao deslogar')
    }
}

export function AuthProvider({children}: AuthProviderProps){

    const [user, setUser] = useState<UserProps>()
    const isAuthenticated = !!user;

    useEffect(() => {
        
        //tentar pegar algo no cookie
        const { '@nextauth.token': token } = parseCookies();

        if(token){
            api.get('/me').then(response => {
                const { id, name, email } = response.data;

                setUser({
                    id,
                    name,
                    email
                })
            
            })
            .catch(() => {
                // se der erro deslogamos o usuário
                signOut();
            })
        }
    }, [])

   async function signIn({ email, password }: SignInProps){
       
        try{
            const response = await api.post('/session', {
                email,
                password
            });

            const { id, name, token } = response.data;

            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, //O token vai expirar em um mês
                path: '/' //Quais caminhos terão acesso ao cookie ('/' significa que todos terão acesso)
            } );

            setUser({
                id,
                name,
                email
            })

            //Passar para as próximas requisições o nosso token
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            toast.success('Logado com sucesso',{
                theme:'dark'
            })
            //Redirecionar o usuário para a página dashboard
            Router.push('/dashboard')

            // console.log(response.data)
        }catch(error){
            toast.error('Email ou senha inválido',{
                theme:'dark'
            })
            console.log('ERRO AO ACESSAR ', error)
        }
    }

    async function signUp({name, email, password}: SignUpProps){
        try{

            const response = await api.post('/users', {
                name,
                email,
                password
            });

            toast.success('Conta criada com sucesso!',{
                theme:'dark'
            })

            Router.push('/')

        }catch(error){
            toast.error('Erro ao cadastrar',{
                theme:'dark'
            })
            console.log('ERRO AO CADASTRAR ', error)
        }
    }

    return(
        <AuthContext.Provider value={{user, isAuthenticated, signIn, signOut, signUp}} >
            {children}
        </AuthContext.Provider>
    )
}