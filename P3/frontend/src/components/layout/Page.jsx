import React from 'react';

const Page = ({ children }) => {
    return (
        <div className={'container mx-auto px-5 pt-10'}>
            {children}
        </div>
    );
};

export default Page;