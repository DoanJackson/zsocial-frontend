import React from 'react';
import Avatar from '@/components/messenger/Avatar';
import { formatTime } from '@/utils/messengerHelpers';

const MessageBubble = ({ msg, isMe, showName, setViewerImage }) => {
    const roundedClassText = isMe
        ? "rounded-t-2xl rounded-bl-2xl"
        : "rounded-t-2xl rounded-br-2xl";

    const bgClassText = isMe
        ? "bg-primary text-white shadow-sm"
        : "bg-surface-container-low text-on-surface";

    return (
        <div className={`flex gap-3 max-w-[75%] lg:max-w-[65%] ${isMe ? 'flex-row-reverse ml-auto' : ''}`}>
            {/* Avatar for others */}
            {!isMe && (
                <div className="self-end mb-1 flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity">
                    <Avatar src={msg.sender?.avatar?.url} name={msg.sender?.fullName} size={32} />
                </div>
            )}

            <div className={`flex flex-col gap-1 min-w-0 ${isMe ? 'items-end' : 'items-start'}`}>
                {showName && !isMe && (
                    <span className="text-[10px] text-on-surface-variant font-bold mb-1 px-1 block max-w-full truncate">
                        {msg.sender?.fullName}
                    </span>
                )}

                {/* Media rendering */}
                {msg.medias && msg.medias.length > 0 && (
                    <div className={`flex flex-wrap gap-2`}>
                        {msg.medias.map(m => (
                            m.type === 'VIDEO' ? (
                                <video
                                    key={m.id}
                                    src={m.url}
                                    controls
                                    preload="metadata"
                                    className="rounded-xl w-full h-auto object-cover max-h-60 shadow-sm cursor-pointer"
                                    style={{ maxWidth: '320px' }}
                                />
                            ) : (
                                <img
                                    key={m.id}
                                    src={m.url}
                                    alt="Shared File"
                                    className="rounded-xl h-auto object-contain max-h-60 shadow-sm cursor-pointer hover:opacity-90 transition-opacity "
                                    onClick={() => setViewerImage({ src: m.url, alt: '' })}
                                />
                            )
                        ))}
                    </div>
                )}

                {/* Text Content */}
                {msg.content && (
                    <div className={`${bgClassText} px-[14px] py-[8px] text-[13px] leading-relaxed ${roundedClassText} break-words whitespace-pre-wrap overflow-hidden`}>
                        {msg.content}
                    </div>
                )}

                {/* Meta data (time and status block) */}
                <div className="flex items-center gap-1 px-1">
                    <span className="text-[10px] text-on-surface-variant">{formatTime(msg.createdAt)}</span>
                    {isMe && (
                        <span className="material-symbols-outlined text-[12px] text-primary filled-icon">
                            check_circle
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
