import React from 'react';

const Container = ({ className, children }) => {
    return (
        <div className={`${className} shelter-detail-box rounded-xl p-5`}>
            {children}
        </div>
    );
};

export default Container;