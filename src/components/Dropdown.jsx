import { useState, useEffect, useRef } from 'react';

export function Dropdown({ label, options = [], invert, disabled, ...otherProps }) {
    const containerRef = useRef(null);
    const [ open, setOpen ] = useState(false);

    const handleClickOutside = (event) => {
        if (containerRef && !containerRef.current.contains(event.target)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOptionsOnClick = (optionOnClick) => {
        if (optionOnClick) {
            setOpen(false);
            optionOnClick();
        }
    }

    const optionsList = options.map((option, index) => {
        return (
            <div 
                key={index} 
                onClick={() => handleOptionsOnClick(option.onClick)}
                className={`text-white px-lg py-md whitespace-nowrap text-center ${ option.onClick ? 'hover:bg-secondary hover:cursor-pointer': null }`}
            >
                {option.label}
            </div>
        );
    });

    return (
        <div 
            className="relative w-fit transition-all"
            {...otherProps} 
            ref={containerRef}
        >
            <div 
                onClick={!disabled ? () => setOpen(prevState => !prevState) : null} 
                className={`text-lg font-bold ${!disabled ? 'hover:-translate-y-0.5 hover:transition-all cursor-pointer' : ''}`}
            >
                {label}
            </div>
            <div className={`${open ? 'block' : 'hidden'} absolute bg-primary w-fit rounded z-10 drop-shadow-lg top-[40px] ${!invert ? 'right-[0]' : 'left-[0]'}`}>
                {optionsList}
            </div>
        </div>
    )
}