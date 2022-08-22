import Login from '@components/Login';
import Image from 'next/image';
import { Dropdown }  from '@components/Dropdown';
import { withUAL } from 'ual-reactjs-renderer';
import { useChain } from '@hooks/useChain';
import { enableChainSelection } from '@configs/globalsConfig';
import Link from 'next/link';

const Header = ({ ual }) => {
    const { handleChain, chain } = useChain();
    
    const chainOptions = [
        { label: 'WAX', onClick: () => handleChain('wax') },
        { label: 'EOS', onClick: () => handleChain('eos') },
    ];

    const chainImages = {
        wax: 'https://wax.bloks.io/img/chains/wax.png',
        eos: 'https://bloks.io/img/chains/eos.png'
    };

    const handleChainImage = () => {
        return (
            <div className="flex gap-md items-center">
                <Image className="object-contain" width="32" height="32" src={chainImages[chain]} alt={chain} />
                <p className="uppercase">{chain}</p>
            </div>
        )        
    };

    return (
        <header className="flex flex-row p-lg justify-between bg-primary text-white sticky top-0 left-0 w-full drop-shadow-md opacity-95 z-40 items-center">
            <Dropdown 
                invert
                options={chainOptions}
                disabled={ual?.activeUser || !enableChainSelection}
                label={handleChainImage()}
            />
            <div className="flex flex-grow gap-lg justify-end">
                <Link href="/">
                    <a className="text-lg hover:-translate-y-0.5 hover:transition-all">Home</a>
                </Link>
                <Link href="/#about">
                    <a className="text-lg hover:-translate-y-0.5 hover:transition-all">About</a>
                </Link>
                <Login />
            </div>
        </header>
    );
}

export default withUAL(Header);
