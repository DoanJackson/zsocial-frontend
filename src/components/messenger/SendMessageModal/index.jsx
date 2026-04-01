import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import chatService from '@/services/chatService';
import Avatar from '@/components/messenger/Avatar';

/**
 * SendMessageModal — Popup để gửi tin nhắn trực tiếp tới một người dùng.
 *
 * Props:
 *   isOpen         {boolean}  — hiển thị / ẩn modal
 *   onClose        {function} — đóng modal
 *   receiverId     {string|number} — ID người nhận
 *   receiverName   {string}   — Tên hiển thị người nhận
 *   receiverAvatar {string}   — URL avatar người nhận (có thể null)
 */
const SendMessageModal = ({ isOpen, onClose, receiverId, receiverName, receiverAvatar }) => {
    const [input, setInput] = useState('');
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [sending, setSending] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        setAttachedFiles(prev => [...prev, ...files]);
        e.target.value = '';
    };

    const handleRemoveFile = (idx) => {
        setAttachedFiles(prev => prev.filter((_, i) => i !== idx));
    };

    const handleClose = () => {
        setInput('');
        setAttachedFiles([]);
        onClose();
    };

    const handleSend = async () => {
        const text = input.trim();
        if ((!text && attachedFiles.length === 0) || sending) return;

        setSending(true);
        try {
            await chatService.sendMessage({
                receiverId,
                content: text,
                files: attachedFiles,
            });
            toast.success('Đã gửi tin nhắn!');
            handleClose();
        } catch (err) {
            console.error(err);
            toast.error('Không thể gửi tin nhắn, thử lại sau');
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const canSend = (input.trim() || attachedFiles.length > 0) && !sending;

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1100]"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-[90%] max-w-[460px] flex flex-col overflow-hidden text-left"
                style={{ animation: 'modalFadeIn 0.18s ease-out' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                    <h3 className="text-base font-bold text-gray-900">Nhắn tin</h3>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Recipient */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50 cursor-default">
                    <Avatar src={receiverAvatar} name={receiverName || '?'} size={36} />
                    <div>
                        <p className="text-sm font-semibold text-gray-900">{receiverName || 'Người dùng'}</p>
                        <p className="text-xs text-gray-400">Gửi tin nhắn riêng</p>
                    </div>
                </div>

                {/* Image previews */}
                {attachedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 px-4 pt-3">
                        {attachedFiles.map((file, idx) => {
                            const url = URL.createObjectURL(file);
                            return (
                                <div key={idx} className="relative group">
                                    <img
                                        src={url}
                                        alt=""
                                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 cursor-pointer"
                                        onLoad={() => URL.revokeObjectURL(url)}
                                    />
                                    <button
                                        onClick={() => handleRemoveFile(idx)}
                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-800/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Text area */}
                <div className="px-4 py-3">
                    <textarea
                        className="w-full resize-none text-sm text-gray-800 placeholder-gray-400 outline-none border border-gray-200 rounded-lg px-3 py-2.5 focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20 transition-colors"
                        placeholder={`Nhắn tin cho ${receiverName || 'người dùng'}...`}
                        rows={4}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 pb-4">
                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    {/* Attach image button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                        title="Đính kèm ảnh"
                    >
                        <svg className="w-5 h-5 text-[#1877f2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Ảnh / Video
                    </button>

                    {/* Send button */}
                    <button
                        onClick={handleSend}
                        disabled={!canSend}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${canSend
                            ? 'bg-[#1877f2] hover:bg-[#166fe5] text-white cursor-pointer'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {sending ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Đang gửi...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                </svg>
                                Gửi
                            </>
                        )}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes modalFadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default SendMessageModal;
