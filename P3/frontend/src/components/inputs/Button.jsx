import React from 'react';

const Button = ({ className, text, onClick, buttonType }) => {
    let buttonClass = ''
    let textClass = ''
    switch (buttonType) {
        case 'primary':
            buttonClass = 'px-3 py-2 w-9/12 rounded-lg border-2 border-[#290005] font-semibold bg-[#290005] mx-4 sm:mx-8';
            break;
        default:
            buttonClass = 'py-2 px-10 rounded-full enabled-button mt-5 w-fit';
            textClass = 'text-sm w-fit font-semibold'
            break;
    }

    return (
        <button className={`text-white hover:opacity-[80%] transition duration-300 ${className} ${buttonClass}`} onClick={onClick}>
            <p className={`${textClass}`}>{text}</p>
        </button>
    );
}

export default Button;