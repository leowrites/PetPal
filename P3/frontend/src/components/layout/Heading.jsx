import React from 'react';

const Heading = ({children}) => {
    return (
        <div className='text-2xl pb-[4px] font-semibold'>
            {children}
        </div>
    );
};

export default Heading;