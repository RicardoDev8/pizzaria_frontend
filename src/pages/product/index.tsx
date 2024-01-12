import { useState, ChangeEvent, FormEvent } from 'react'
import styles from './styles.module.scss'
import Head from "next/head";
import { Header } from '../../components/Header';

import { setupApiClient } from '../../services/api'

import { canSSRAuth } from '../../utils/canSSRAuth'

import { FiUpload } from 'react-icons/fi'

import { toast } from 'react-toastify';

type ItemProps = {
    id: string;
    name: string;
}

interface CategoryProps{
    categoryList: ItemProps[]; 
}

export default function product({ categoryList }: CategoryProps){

    const [avatarUrl, setAvatarUrl] = useState('')
    const [imageAvatar, setImageAvatar] = useState(null)

    const [categories, setCategories] = useState(categoryList || [])
    const [categorySelected, setCategorySelected] = useState(0)

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')

    function handleFile(event: ChangeEvent<HTMLInputElement>){

        if(!event.target.files){
            return;
        }

        const image = event.target.files[0];

        if(!image){
            return;
        }

        if(image.type === 'image/jpeg' || image.type === 'image/png' || image.type === 'image/jpg'){

            setImageAvatar(image);
            setAvatarUrl(URL.createObjectURL(event.target.files[0]));
            
        }
    }

    function handleChangeCategory(event){
        setCategorySelected(event.target.value)
    }

    async function handleRegister(event: FormEvent){
        event.preventDefault();
        try{
            const data = new FormData();

            if(name === '' || price === '' || description ==='' || imageAvatar === null){
                toast.warning('Preencha todos os campos', {theme: 'dark'})
                return;
            }

            data.append('name', name);
            data.append('price', price);
            data.append('description', description);
            data.append('category_id', categories[categorySelected].id);
            data.append('file', imageAvatar);

            const apiClient = setupApiClient();
            await apiClient.post('/product', data);

            toast.success('Cadastrado com sucesso!',{theme: 'dark'})

        }catch(error){
            console.log(error)
            toast.error('Ops! Erro ao cadastrar', {theme: 'dark'})
        }

        setName('');
        setPrice('')
        setDescription('');
        setImageAvatar(null);
        setAvatarUrl('');
    }

    return(
        <>
        <Head>
            <title>Novo produto - Pizzaria</title>
        </Head>
        <div>
            <Header/>
            
            <main className={styles.container} >
                <h1>Novo produto</h1>

                <form className={styles.form} onSubmit={handleRegister} >
                    
                    <label className={styles.labelAvatar} >
                        <span>
                            <FiUpload size={30} color='#FFF' />
                        </span>
                        <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleFile} />

                        {avatarUrl && (
                            <img 
                            className={styles.preview}
                            src={avatarUrl}
                            alt="Foto do produto"
                            width={250}
                            height={250}
                            />
                        )}
                    </label>

                    <select value={categorySelected} onChange={handleChangeCategory} >
                        {categories.map((item, index) => {
                            return(
                                <option key={item.id} value={index} >
                                    {item.name}
                                </option>
                            )
                        })}
                    </select>

                    <input 
                    type="text"
                    placeholder="Digite o nome do produto"
                    className={styles.input}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    />

                    <input 
                    type="text"
                    placeholder="Preço do produto"
                    className={styles.input}
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    />

                    <textarea 
                    placeholder="Descreva seu produto..."
                    className={styles.input}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    />

                    <button className={styles.buttonAdd} type="submit" >
                        Cadastrar
                    </button>
                </form>
            </main>
        </div>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async (context) => {

    const apiClient = setupApiClient(context)

    const response = await apiClient.get('/category');


    return {
        props: {
            categoryList: response.data
        }
    }
})