import React from 'react';

const ImgContainer = ({ className, src, alt='Image' }) => {
    return (
        <img
            class={`${className} rounded-xl max-w-full h-full object-cover shelter-photo`}
            src={src}
            alt={alt}
        />
    );
};

export default ImgContainer;