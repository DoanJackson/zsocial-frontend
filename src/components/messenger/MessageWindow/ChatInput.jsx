import React, { useRef } from 'react';

const ChatInput = ({ 
    input, 
    setInput, 
    handleKeyDown, 
    handleSend, 
    sending, 
    attachedFiles, 
    handleFileChange 
}) => {
    const fileInputRef = useRef(null);

    return (
        <footer className="flex-shrink-0 p-4 md:p-6 bg-surface-container-lowest border-t border-outline-variant/10">
            <div className="flex items-center gap-3 bg-surface-container-low p-2 rounded-full pr-4">
                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-primary hover:bg-surface-container transition-colors rounded-full cursor-pointer active:scale-95"
                    title="Đính kèm Ảnh/Video"
                >
                    <span className="material-symbols-outlined">add</span>
                </button>
                <input 
                    className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-on-surface placeholder:text-outline" 
                    placeholder="Nhập tin nhắn..." 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={sending}
                />
                <div className="flex items-center gap-2">
                    <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95">
                        <span className="material-symbols-outlined">sentiment_satisfied</span>
                    </button>
                    <button 
                        onClick={handleSend}
                        disabled={(!input.trim() && attachedFiles.length === 0) || sending}
                        className={`w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition-all ${
                            (input.trim() || attachedFiles.length > 0) && !sending
                                ? 'bg-primary text-white shadow-blue-500/30 hover:scale-105 active:scale-95 cursor-pointer'
                                : 'bg-surface-container text-outline cursor-not-allowed shadow-none'
                        }`}
                    >
                        {sending ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin cursor-wait" />
                        ) : (
                            <span className="material-symbols-outlined filled-icon">send</span>
                        )}
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default ChatInput;
