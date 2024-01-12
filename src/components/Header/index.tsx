import { useContext } from 'react'
import styles from './styles.module.scss'
import Link from 'next/link'

import { FiLogOut } from 'react-icons/fi'

import { AuthContext, signOut } from '../../contexts/AuthContext'

export function Header(){

    const { signUp} = useContext(AuthContext)

    return(
        <header className={styles.headerContainer}>
           <div className={styles.headerContent} >
            <Link href="/dashboard" >
                <img src="/logo.svg" alt="logo pizzaria" width={190} height={60} />
            </Link>

            <nav className={styles.menuNav} >
                <Link href="/category" >
                    Nova categoria
                </Link>
                <Link href="/product" >
                    Cardápio
                </Link> 
            <button onClick={signOut} >
                <FiLogOut color="#FFF" size={24} />
                
            </button>
            </nav>
           </div>
        </header>
    )
}