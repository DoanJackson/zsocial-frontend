import React, { useState, useRef, useEffect } from 'react';
import Modal from '../../Modal';
import postService from '../../../services/postService';
import { toast } from 'react-toastify';

const CreatePostModal = ({ isOpen, onClose, onSubmit, userAvatar, userName }) => {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('PUBLIC');
    const [mediaFiles, setMediaFiles] = useState([]);
    const [mediaPreviews, setMediaPreviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);

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

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [content, isOpen]);

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
    };

    const removeMedia = (index) => {
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
        setMediaPreviews(prev => {
            const newPreviews = [...prev];
            URL.revokeObjectURL(newPreviews[index].url);
            return newPreviews.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async () => {
        if (!content.trim() && mediaFiles.length === 0) return;

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
        <Modal isOpen={isOpen} onClose={onClose} title="Tạo bài viết">
            <div>
                <div className="flex items-center gap-[0.8rem] mb-4">
                    <img src={userAvatar} alt="User Avatar" className="w-10 h-10 rounded-full bg-[#ddd] object-cover" />
                    <div className="flex flex-col items-start">
                        <span className="font-semibold block text-[0.95rem] mb-[2px]">{userName || 'User Name'}</span>
                        <select
                            className="py-1 px-2 border-none rounded-md text-[0.85rem] bg-[#e4e6eb] focus:bg-[#d8dadf] cursor-pointer font-semibold text-[#050505] outline-none appearance-none pr-6 bg-no-repeat bg-[right_0.5rem_center] bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5z%22%20fill%3D%22%23050505%22%2F%3E%3C%2Fsvg%3E')]"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="PUBLIC">Công khai</option>
                            <option value="ARCHIVED">Lưu nháp</option>
                        </select>
                    </div>
                </div>

                <div className="max-h-[400px] overflow-y-auto mb-4">
                    <input
                        type="text"
                        className="w-full border-none rounded-lg p-3 text-[1.1rem] font-semibold mb-3 outline-none bg-[#f0f2f5] focus:bg-[#e4e6eb] box-border transition-colors duration-200 placeholder-[#65676b] font-normal"
                        style={{ fontWeight: title ? '600' : 'normal' }}
                        placeholder="Tiêu đề bài viết (tùy chọn)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <textarea
                        ref={textareaRef}
                        className="w-full min-h-[150px] max-h-[300px] border-none rounded-lg text-[1.2rem] resize-none font-inherit mb-4 p-3 bg-[#f0f2f5] focus:bg-[#e4e6eb] box-border transition-colors duration-200 overflow-y-auto focus:outline-none placeholder-[#65676b]"
                        placeholder="Bạn đang nghĩ gì thế?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        autoFocus
                        rows={3}
                    />

                    {mediaPreviews.length > 0 && (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-[10px] mt-[10px]">
                            {mediaPreviews.map((media, index) => (
                                <div key={index} className="relative w-full pt-[100%] rounded-lg overflow-hidden bg-[#f0f2f5] [&>img]:absolute [&>img]:top-0 [&>img]:left-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover [&>video]:absolute [&>video]:top-0 [&>video]:left-0 [&>video]:w-full [&>video]:h-full [&>video]:object-cover">
                                    {media.type === 'VIDEO' ? (
                                        <video src={media.url} controls />
                                    ) : (
                                        <img src={media.url} alt={`preview-${index}`} />
                                    )}
                                    <button
                                        className="absolute top-1 right-1 bg-white/80 hover:bg-white border-none rounded-full p-0 w-6 h-6 flex items-center justify-center cursor-pointer text-[1.2rem] leading-none text-[#333] transition-colors"
                                        onClick={() => removeMedia(index)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border border-[#ddd] rounded-lg p-[0.8rem] flex justify-between items-center mb-4">
                    <span className="font-semibold text-[0.9rem]">Thêm vào bài viết</span>
                    <div className="flex gap-[0.5rem]">
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-[#f0f2f5]"
                            onClick={() => fileInputRef.current.click()}
                            title="Ảnh/Video"
                        >
                            <span className="text-[1.5rem]">📷</span>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            multiple
                            accept="image/*,video/*"
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                <div className="flex">
                    <button
                        className="bg-[#1877f2] text-white w-full rounded-lg py-2 font-semibold hover:bg-[#166fe5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        onClick={handleSubmit}
                        disabled={(!content.trim() && mediaFiles.length === 0) || isSubmitting}
                    >
                        {isSubmitting ? 'Đang đăng...' : 'Đăng'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CreatePostModal;
