import React from 'react';

const PostDetailCommentList = ({ children }) => {
    return (
        <div className="px-6 py-6 space-y-6 bg-surface-container-low/20">
            <h3 className="font-headline font-bold text-sm text-on-surface-variant px-1 read-only">Tất cả bình luận</h3>
            {children}
        </div>
    );
};

export default PostDetailCommentList;
