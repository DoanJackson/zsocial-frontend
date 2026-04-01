import React from 'react';

const PostDetailBody = ({ content, title }) => {
    return (
        <div className="px-6 py-4">
            {title && <h1 className="font-headline font-bold text-xl mb-2 text-on-surface">{title}</h1>}
            <p className="text-on-surface text-base leading-relaxed font-medium whitespace-pre-wrap">
                {content}
            </p>
        </div>
    );
};

export default PostDetailBody;
