import React, { useRef } from 'react';

const MobileChatInput = ({ input, setInput, handleKeyDown, handleSend, sending, handleFileChange, attachedFiles = [] }) => {
    const fileInputRef = useRef(null);

    return (
        <footer className="fixed bottom-0 left-0 w-full p-[8px] bg-surface-container-lowest/80 backdrop-blur-xl border-t border-outline-variant/10 z-50 md:hidden">
            <div className="max-w-3xl mx-auto flex items-center gap-[8px] bg-surface-container-low rounded-full pr-[12px] py-[4px] pl-[4px]">
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
                    className="w-[32px] h-[32px] flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-95 ml-[2px] cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                </button>
                <input 
                    className="flex-1 bg-transparent border-none outline-none text-[13px] text-on-surface placeholder:text-outline focus:ring-0 px-[8px] py-[6px]" 
                    placeholder="Nhập tin nhắn..." 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={sending}
                />
                <div className="flex items-center gap-[6px]">
                    <button className="w-[28px] h-[28px] flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95">
                        <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
                    </button>
                    <button 
                        onClick={handleSend}
                        disabled={sending || (!input.trim() && attachedFiles.length === 0)}
                        className={`w-[32px] h-[32px] flex items-center justify-center rounded-full shadow-lg transition-all ${
                            ((input.trim() || attachedFiles.length > 0) && !sending) 
                                ? 'bg-primary text-white shadow-primary/30 hover:scale-105 active:scale-95 cursor-pointer' 
                                : 'bg-surface-variant text-on-surface-variant shadow-none opacity-50 cursor-not-allowed'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {sending ? 'hourglass_empty' : 'send'}
                        </span>
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default MobileChatInput;
