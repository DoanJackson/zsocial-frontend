import React, { useState, useEffect, useRef } from 'react';
import commentService from '../../../services/commentService';
import { getUserAvatarUrl } from '../../../utils/avatarUtils';


const CommentInput = ({ postId, replyingTo, setReplyingTo, onCommentAdded, autoFocus }) => {
    const [commentContent, setCommentContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus, replyingTo]);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const clearSelectedFile = () => {
        setSelectedFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentContent.trim() && !selectedFile) return;

        setSubmitting(true);
        try {
            const files = selectedFile ? [selectedFile] : [];
            await commentService.createComment(postId, commentContent, replyingTo?.id || null, files);

            setCommentContent('');
            if (setReplyingTo) setReplyingTo(null);
            clearSelectedFile();

            if (onCommentAdded) {
                onCommentAdded(postId);
            }
        } catch (error) {
            console.error("Failed to post comment", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="flex gap-2 py-4 border-t border-[#ced0d4] items-start" onSubmit={handleCommentSubmit}>
            <img
                src={getUserAvatarUrl()}
                alt="User"
                className="w-8 h-8 rounded-full object-cover mt-0.5"
            />
            <div className="flex-1 flex flex-col">
                <div className="flex flex-col bg-[#f0f2f5] rounded-[18px] py-2 px-[0.8rem]">
                    {replyingTo && (
                        <div className="w-fit flex items-center bg-[#e4e6eb] px-[0.6rem] py-[0.2rem] rounded-[12px] text-[0.85rem] font-semibold mr-2 whitespace-nowrap mb-1">
                            {replyingTo.authorName}
                            <span className="ml-[0.4rem] cursor-pointer text-base text-[#65676b] leading-none hover:text-[#050505]" onClick={() => setReplyingTo(null)}>&times;</span>
                        </div>
                    )}
                    <input
                        type="text"
                        ref={inputRef}
                        className="w-full bg-transparent border-none outline-none pt-[0.2rem] pb-2 text-[0.95rem]"
                        placeholder="Viết bình luận..."
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        disabled={submitting}
                    />
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-[2px]">
                            <button type="button" className="bg-transparent border-none rounded-full w-[26px] h-[26px] flex items-center justify-center cursor-pointer text-[#65676b] text-[0.95rem] p-0 hover:bg-[#e4e6eb] transition-colors">😃</button>
                            <label htmlFor="comment-file-input" className="bg-transparent border-none rounded-full w-[26px] h-[26px] flex items-center justify-center cursor-pointer text-[#65676b] text-[0.95rem] p-0 hover:bg-[#e4e6eb] transition-colors">📷</label>
                            <button type="button" className="bg-transparent border-none rounded-full w-[26px] h-[26px] flex items-center justify-center cursor-pointer text-[#65676b] text-[0.95rem] p-0 hover:bg-[#e4e6eb] transition-colors">GIF</button>
                            <button type="button" className="bg-transparent border-none rounded-full w-[26px] h-[26px] flex items-center justify-center cursor-pointer text-[#65676b] text-[0.95rem] p-0 hover:bg-[#e4e6eb] transition-colors">🎭</button>
                            <input
                                id="comment-file-input"
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                disabled={submitting || selectedFile}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-transparent border-none text-[#1877f2] p-[0.3rem] rounded-full flex items-center justify-center cursor-pointer ml-[2px] hover:not(:disabled):bg-[#e4e6eb] disabled:text-[#bcc0c4] disabled:cursor-not-allowed transition-colors"
                            disabled={submitting || (!commentContent.trim() && !selectedFile)}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {selectedFile && previewUrl && (
                    <div className="mt-2 flex justify-start">
                        <div className="relative inline-block max-w-[200px] rounded-lg overflow-hidden border border-[#ddd]">
                            {selectedFile.type.startsWith('video/') ? (
                                <video src={previewUrl} className="w-full h-auto block max-h-[200px] object-cover" controls />
                            ) : (
                                <img src={previewUrl} alt="Preview" className="w-full h-auto block max-h-[200px] object-cover" />
                            )}
                            <button
                                type="button"
                                className="absolute top-[5px] right-[5px] bg-black/50 hover:bg-black/70 text-white border-none rounded-full w-6 h-6 flex items-center justify-center cursor-pointer text-[1.2rem] leading-none transition-colors"
                                onClick={clearSelectedFile}
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </form>
    );
};

export default CommentInput;
