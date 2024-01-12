import { useState, FormEvent } from 'react'
import Head from 'next/head';
import { Header } from '../../components/Header';
import styles from './styles.module.scss'

import { setupApiClient } from '../../services/api'
import { toast } from 'react-toastify';

import { canSSRAuth } from '../../utils/canSSRAuth'

export default function Category(){

    const [name, setName] = useState('')

   async function handleRegister(event: FormEvent){
        event.preventDefault();

        if(name === ''){
            toast.warning('Informe a categoria!', {theme: 'dark'})
            return;
        }

        const apiClient = setupApiClient();
        await apiClient.post('/category', {
            name: name
        });

        toast.success('Categoria cadastrada com sucesso!', {
            theme: 'dark'
        });
        setName('')
    }
 
    return(
        <>
        <Head>
            <title>Nova categoria - sujeito pizzaria</title>
        </Head>
        <div>
            <Header/>
            <main className={styles.container}>
                <h1>Cadastrar categorias</h1>
                <form className={styles.form} onSubmit={handleRegister} >
                    <input 
                    type='text'
                    placeholder='Digite o nome da categoria'
                    className={styles.input}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    />
                    <button type='submit' className={styles.buttonAdd} >
                        Cadastrar
                    </button>
                </form>
            </main>
        </div>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async (context) => {

    return {
        props: {}
    }
})