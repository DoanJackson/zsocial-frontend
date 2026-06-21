import React from 'react';

const PostDetailBody = ({ content, title }) => {
    return (
        <div className="px-6 py-2">
            {title && <h1 className="text-lg font-bold text-on-background mb-2 leading-snug">{title}</h1>}
            <p className="text-on-surface leading-relaxed whitespace-pre-wrap">
                {content}
            </p>
        </div>
    );
};

export default PostDetailBody;
