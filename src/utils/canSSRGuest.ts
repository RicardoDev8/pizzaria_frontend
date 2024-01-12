import { GetServerSideProps, GetServerSidePropsResult, GetServerSidePropsContext } from 'next'
import { parseCookies } from 'nookies'

//Função para páginas que só podem ser acessadas por visitantes
export function canSSRGuest<P>(fn: GetServerSideProps<P>){

    return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(context);

        if(cookies['@nextauth.token']){
            return {
                redirect:{
                    destination: '/dashboard',
                    permanent: false
                }
            }
        }

        return await fn(context);
    }
}