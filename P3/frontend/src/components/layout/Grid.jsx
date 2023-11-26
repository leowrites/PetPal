import React from 'react';

const Grid = ({ className, children }) => {
    return (
        <div className={`${className} grid gap-5`}>
            {children}
        </div>
    );
};

export default Grid;