import React from 'react';

const Page = ({ children }) => {
    return (
        <main>
            <div className={'container mx-auto px-5 pt-10'}>
                {children}
            </div>
        </main>
    );
};

export default Page;