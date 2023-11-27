import React from 'react';

const Button = ({ className, onClick, buttonType, children}) => {
    let buttonClass = ''
    switch (buttonType) {
        case 'primary':
            buttonClass = 'px-3 py-2 w-9/12 rounded-lg border-2 border-[#290005] font-semibold bg-[#290005] sm:mx-8';
            break;
        default:
            buttonClass = 'py-2 px-[1rem] rounded-full enabled-button w-fit';
            break;
    }

    return (
        <button className={`text-white hover:opacity-[80%] transition duration-300 ${className} ${buttonClass}`} onClick={onClick}>
            {children}
        </button>
    );
}

export default Button;