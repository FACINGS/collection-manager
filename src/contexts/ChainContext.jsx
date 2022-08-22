import { createContext, useState } from 'react';
import { UALProvider } from 'ual-reactjs-renderer';
import { useRouter } from 'next/router';
import { appName } from '@configs/globalsConfig';
import chains from '@libs/chains';

export const ChainContext = createContext();

export const ChainProvider = ({ children }) => {
    const router = useRouter();
    const [chain, setChain] = useState();
    
    async function handleChain(chain) {
        await router.replace(`/?chain=${chain}`, undefined, {
            shallow: true,
        });
        router.reload();
    }
    
    return (
        <ChainContext.Provider value={{ handleChain, chain, setChain }}>
            { chain ? (
                <UALProvider 
                    chains={chains[chain].chain} 
                    authenticators={chains[chain].authenticators} 
                    appName={appName} 
                >
                    {children}
                </UALProvider>
            ) : children }
        </ChainContext.Provider>
    );
};
