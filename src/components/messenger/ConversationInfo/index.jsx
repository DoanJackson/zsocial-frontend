import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import chatService from '../../../services/chatService';
import Avatar from '../Avatar';

function ConversationInfo({ conversation }) {
    const [members, setMembers] = useState(null);
    const [showMembers, setShowMembers] = useState(false);
    const [loadingMembers, setLoadingMembers] = useState(false);

    const handleToggleMembers = async () => {
        if (showMembers) { setShowMembers(false); return; }
        if (members) { setShowMembers(true); return; }
        setLoadingMembers(true);
        try {
            const res = await chatService.getMembers(conversation.id);
            setMembers(res.data);
            setShowMembers(true);
        } catch (e) {
            toast.error('Không thể tải thành viên');
        } finally {
            setLoadingMembers(false);
        }
    };

    useEffect(() => {
        setMembers(null);
        setShowMembers(false);
    }, [conversation.id]);

    const sections = [
        { label: 'Thông tin về đoạn chat', key: 'info' },
        { label: 'Tùy chỉnh đoạn chat', key: 'custom' },
        { label: 'File phương tiện, file và liên kết', key: 'media' },
        { label: 'Quyền riêng tư và hỗ trợ', key: 'privacy' },
    ];

    return (
        <div className="flex flex-col h-full bg-white border-l border-gray-200 overflow-y-auto">
            <div className="flex flex-col items-center py-6 px-4 border-b border-gray-100">
                <Avatar src={conversation.avatar} name={conversation.groupName} size={72} />
                <h3 className="mt-3 font-bold text-base text-gray-900 text-center">
                    {conversation.groupName || 'Cuộc trò chuyện'}
                </h3>
                <p className="text-xs text-green-500 mt-1">Đang hoạt động</p>
                <div className="flex gap-6 mt-4">
                    <button className="flex flex-col items-center gap-1 group">
                        <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </div>
                        <span className="text-[10px] text-gray-500">Bắt lại</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 group">
                        <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <span className="text-[10px] text-gray-500">Tìm kiếm</span>
                    </button>
                </div>
            </div>

            {/* Members section */}
            <div className="border-b border-gray-100">
                <button
                    onClick={handleToggleMembers}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                    <span className="text-sm font-semibold text-gray-800">Thành viên trong đoạn chat</span>
                    <div className="flex items-center gap-2">
                        {loadingMembers && <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />}
                        <svg
                            className={`w-4 h-4 text-gray-500 transition-transform ${showMembers ? 'rotate-180' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>
                {showMembers && members && (
                    <div className="px-4 pb-3">
                        <p className="text-xs text-gray-400 mb-2">{members.numOfMem} thành viên</p>
                        <div className="flex flex-col gap-2">
                            {members.members?.map((m, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <Avatar src={m.user?.avatar?.url} name={m.user?.fullName || m.user?.username} size={36} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {m.user?.fullName || m.user?.username}
                                        </p>
                                        {m.role === 'ADMIN' && (
                                            <span className="text-[10px] text-blue-500 font-semibold">Quản trị viên</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {sections.map(s => (
                <button
                    key={s.key}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                    <span className="text-sm font-semibold text-gray-800">{s.label}</span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            ))}
        </div>
    );
}

export default ConversationInfo;
