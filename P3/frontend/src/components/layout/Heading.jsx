import React from 'react';

const Heading = ({children}) => {
    return (
        <h1 className='text-2xl pb-[4px] font-semibold'>
            {children}
        </h1>
    );
};

export default Heading;