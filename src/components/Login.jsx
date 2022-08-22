import { useState, useEffect } from 'react';
import { Dropdown }  from '@components/Dropdown';
import { withUAL } from 'ual-reactjs-renderer';
import { useChain } from '@hooks/useChain';
import { getEosAccountInfo } from '@services/account/getEosAccount';
import { getWaxAccountInfo } from '@services/account/getWaxAccount';
import { isEosChain } from '@utils/chainVerification';
import { useRouter } from 'next/router';

const Login = ({ ual }) => {

    const router = useRouter();
    const { setChain } = useChain();
    const [accountInformation, setAccountInformation] = useState();
    
    let availableRam;
    
    if (accountInformation) {
        availableRam = ((accountInformation.ram.quota - accountInformation.ram.used) * 100 / accountInformation.ram.quota).toFixed(2);        
    }
    
    useEffect(() => {
        if (ual?.activeUser) {
            if (isEosChain(ual.activeUser.chainId)) {
                getEosAccountInfo(ual.activeUser, setAccountInformation);
                setChain('eos');
            } else {
                getWaxAccountInfo(ual.activeUser, setAccountInformation);
                setChain('wax')
            }
        } else {
            setChain(window.location.search.replace('?chain=', '') || 'eos');
        }
    }, [ual, setChain]);

    if (!ual?.activeUser) {
        return (
            <button 
                className="text-lg"
                onClick={ual?.showModal}
            >
                Login
            </button>
        );
    };

    const handleUserResources = () => {
        return (
            <div className="items-center flex flex-col text-sm gap-[8px]">
                <p className="uppercase font-bold">Available Resources</p>
                <p>RAM: {availableRam}%</p>
            </div>
        );
    }

    const dropdownOptions = [
        { label: handleUserResources() },
        { label: 'Log Out', onClick: () => { ual.logout(); router.reload() } },
    ];

    return (    
        <Dropdown 
            label={ual.activeUser.accountName}
            options={dropdownOptions}
        />
    );
}

export default withUAL(Login);
