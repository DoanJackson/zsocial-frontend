import React, { useState, useRef, useEffect } from 'react';
import postService from '@/services/postService';
import { toast } from 'react-toastify';

import PopupOverlay from './PopupOverlay';
import PopupHeader from './PopupHeader';
import PopupUserInfo from './PopupUserInfo';
import PostBodyInput from './PostBodyInput';
import PopupActions from './PopupActions';

const CreatePostModal = ({ isOpen, onClose, onSubmit, userAvatar, userName }) => {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('PUBLIC');
    const [mediaFiles, setMediaFiles] = useState([]);
    const [mediaPreviews, setMediaPreviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!isOpen) {
            setContent('');
            setTitle('');
            setStatus('PUBLIC');
            setMediaFiles([]);
            setMediaPreviews([]);
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newPreviews = files.map(file => ({
            url: URL.createObjectURL(file),
            type: file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE',
            file: file
        }));

        setMediaFiles(prev => [...prev, ...files]);
        setMediaPreviews(prev => [...prev, ...newPreviews]);
        
        // Reset so same file can be chosen again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeMedia = (index) => {
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
        setMediaPreviews(prev => {
            const newPreviews = [...prev];
            URL.revokeObjectURL(newPreviews[index].url);
            return newPreviews.filter((_, i) => i !== index);
        });
    };

    const handleFormSubmit = async () => {
        if (!title.trim() && !content.trim() && mediaFiles.length === 0) return;

        setIsSubmitting(true);
        try {
            const postData = { title, content, status };
            const response = await postService.createPost(postData, mediaFiles);

            if (response.success) {
                toast.success('Đăng bài thành công!');
                if (onSubmit) {
                    onSubmit(response.data);
                }
                onClose();
            } else {
                toast.error(response.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error(error);
            toast.error('Lỗi kết nối server');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PopupOverlay isOpen={isOpen} onClose={onClose}>
            <PopupHeader onClose={onClose} title="Tạo bài viết" />
            
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col">
                <PopupUserInfo 
                    userAvatar={userAvatar} 
                    userName={userName} 
                    status={status} 
                    onChangeStatus={setStatus} 
                />
                
                <PostBodyInput 
                    title={title}
                    onChangeTitle={setTitle}
                    content={content}
                    onChangeContent={setContent}
                    mediaPreviews={mediaPreviews}
                    onRemoveMedia={removeMedia}
                    onFileClick={() => fileInputRef.current?.click()}
                />
            </div>
            
            <PopupActions 
                onFileClick={() => fileInputRef.current?.click()}
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
                isDisabled={(!title.trim() && !content.trim() && mediaFiles.length === 0) || isSubmitting}
            />

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/*,video/*"
                style={{ display: 'none' }}
            />
        </PopupOverlay>
    );
};

export default CreatePostModal;
