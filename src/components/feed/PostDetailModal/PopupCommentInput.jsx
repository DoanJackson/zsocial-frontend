import React, { useState, useEffect, useRef } from 'react';
import commentService from '@/services/commentService';
import { getUserAvatarUrl } from '@/utils/avatarUtils';

const PopupCommentInput = ({ postId, replyingTo, setReplyingTo, onCommentAdded, autoFocus }) => {
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
        <form className="p-4 bg-white border-t border-surface-container-low flex flex-col gap-2 shrink-0" onSubmit={handleCommentSubmit}>
            {/* Image Attachment Preview Placeholder */}
            {selectedFile && previewUrl && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface-container border border-surface-container-high">
                        {selectedFile.type.startsWith('video/') ? (
                            <video src={previewUrl} className="w-full h-full object-cover" controls />
                        ) : (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        )}
                        <button
                            type="button"
                            className="cursor-pointer absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 text-white flex items-center justify-center transition-all hover:bg-black/80"
                            onClick={clearSelectedFile}
                        >
                            <span className="material-symbols-outlined text-[10px]">close</span>
                        </button>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-primary-container">
                    <img
                        className="w-full h-full object-cover"
                        alt="User Avatar"
                        src={getUserAvatarUrl()}
                    />
                </div>
                <div className="flex-1 relative flex flex-col justify-center">
                    {replyingTo && (
                        <div className="absolute -top-7 left-0 w-fit flex items-center bg-surface-container-high px-2 py-0.5 rounded-full text-[10px] font-bold text-on-surface-variant z-10">
                            Replying to {replyingTo.authorName}
                            <span 
                                className="ml-1 cursor-pointer hover:text-error transition-colors"
                                onClick={() => setReplyingTo(null)}
                            >
                                <span className="material-symbols-outlined text-[12px]">close</span>
                            </span>
                        </div>
                    )}
                    
                    <label 
                        htmlFor="comment-file-input" 
                        className="absolute left-3 text-on-surface-variant hover:text-primary transition-colors flex items-center cursor-pointer z-10" 
                        title="Đính kèm ảnh"
                    >
                        <span className="material-symbols-outlined text-xl">image</span>
                    </label>
                    <input
                        id="comment-file-input"
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="hidden"
                        disabled={submitting || selectedFile}
                    />

                    <input
                        type="text"
                        ref={inputRef}
                        className="w-full bg-surface-container-low border-none rounded-lg py-2.5 pl-11 pr-12 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body text-on-surface placeholder:text-on-surface-variant"
                        placeholder="Viết bình luận..."
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        disabled={submitting}
                    />

                    <button 
                        type="button"
                        className="cursor-pointer absolute right-3 text-on-surface-variant hover:text-primary transition-colors z-10"
                    >
                        <span className="material-symbols-outlined text-xl">mood</span>
                    </button>
                </div>
                <button
                    type="submit"
                    className={`cursor-pointer w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all shrink-0 ${
                        (!commentContent.trim() && !selectedFile) || submitting
                        ? 'bg-surface-container-high text-outline cursor-not-allowed'
                        : 'bg-primary text-white shadow-primary/20 active:scale-90 hover:bg-primary-dim'
                    }`}
                    disabled={submitting || (!commentContent.trim() && !selectedFile)}
                >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                </button>
            </div>
        </form>
    );
};

export default PopupCommentInput;
