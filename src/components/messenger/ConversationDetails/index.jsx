import React from 'react';
import Avatar from '@/components/messenger/Avatar';
import { useConversationDetails } from '@/hooks/useConversationDetails';

const ConversationDetails = ({ conversation, onClose }) => {
    const { members, showMembers, loadingMembers, handleToggleMembers } = useConversationDetails(conversation.id);

    return (
        <section className="hidden lg:flex w-[280px] flex-col bg-surface-container-low h-full overflow-y-auto custom-scrollbar p-[20px] relative border-l border-outline-variant/10">
            <button 
                onClick={onClose}
                className="absolute top-[16px] right-[16px] p-[8px] text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors cursor-pointer"
            >
                <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                    <Avatar src={conversation.avatar} name={conversation.groupName || '?'} size={96} />
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-surface-container-low rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold text-on-surface font-headline">{conversation.groupName || 'Cuộc trò chuyện'}</h3>
                {/* Optional description, hardcoded as in Stitch design */}
                <p className="text-sm text-on-surface-variant text-center">Đang hoạt động</p>
            </div>

            <div className="space-y-8">
                {/* Preserved logic button disguised in Stitch UI */}
                <div>
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Tùy chỉnh</h4>
                    <div className="space-y-3">
                        <button 
                            onClick={handleToggleMembers}
                            className="w-full flex items-center justify-between text-sm text-on-surface font-medium px-2 py-1 hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer"
                        >
                            <span>Thành viên</span>
                            {loadingMembers ? (
                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <span className={`material-symbols-outlined text-outline transition-transform ${showMembers ? 'rotate-180' : ''}`}>
                                    chevron_right
                                </span>
                            )}
                        </button>

                        {/* Preserved member display logic using Stitch generic div styles so we don't break design */}
                        {showMembers && members && (
                            <div className="pl-4 space-y-2 mt-2">
                                {members.members?.map((m, idx) => (
                                    <div key={idx} className="flex items-center gap-2 cursor-pointer hover:bg-surface-container-high p-1 rounded-lg transition-colors">
                                        <Avatar src={m.user?.avatar?.url} name={m.user?.fullName || m.user?.username} size={24} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-on-surface truncate">
                                                {m.user?.fullName || m.user?.username}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button className="w-full flex items-center justify-between text-sm text-on-surface font-medium px-2 py-1 hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer">
                            <span>Chủ đề</span>
                            <div className="w-4 h-4 rounded-full bg-primary"></div>
                        </button>
                        <button className="w-full flex items-center justify-between text-sm text-on-surface font-medium px-2 py-1 hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer">
                            <span>Biểu tượng cảm xúc</span>
                            <span className="text-lg">🎨</span>
                        </button>
                    </div>
                </div>

                <div>
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Ảnh & File</h4>
                    <div className="grid grid-cols-3 gap-2">
                        <img alt="Gallery 1" className="aspect-square rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdkhNs867uSwgNuiB4mU26x9v0SxoO8bHYYwXE8J4bNLVzCtHCukW6TH2HmiqTPYrFJU8Vr4-jNA8PCYIqGb6VNByClyZx9hmntuBUbzri24bLqZ3IE0H-Wc6XAYI54jAowvlTL7gnGOAsUAz6DgDu4hch-XiZK8su7FY-PXZW6mKhjDcSlTcfM49izlhhzxd1qfgSzBXHrkNZe7hk2bZU9xD2Q3wxXtgbuVNqTTvhdKqBT_D_6ofu_9aVSX5UvHUOPN1HfQtJHwzk" />
                        <img alt="Gallery 2" className="aspect-square rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoTLvS0reTrY9bsGdUgKhppBHpbxoPydRLl9khM-6q17IJRyuy7HwLJw9SNZVKaydPWF3eNXMH2kHIPB3LDDxVZi9iNtPseJDqk_w5GMLVRq0A4_efqUJz9abtzkAUTs83NnMl2kHjO5VuSGHsE8EMtdv08RQPe4W1Zw9ri0T41U3fKq7RJ24UqUKHzyGCMN-IbTF_Dc5roMe9Ay2BTnklgk0-uWrCqooUrEc8A4sYhPoe1_xDz8tDxKZe9nsFRmAXzH2AMk4gFnd7" />
                        <img alt="Gallery 3" className="aspect-square rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMY_BdReX340jpu99hF1T4vmic8Usn4vD-GpofJxY-26yWRLEdJbL89t-PdwT0Q52Gg8DKzSfw-mFlUCAYT0i114gaPhbmZZFkM5P1weDyU6Nb-AWI46OXj7F979fGsGthCchesLTqFHI8W0nvThHxen4gvs2i5P_Q6AA-WRKzUmxyvQtX-buBkfzIWPvvIqU2CqiL1HmXw3yDs1TALHqnliEmd4o2joQZvqkIz7dIpx7t1qz-Mmv4XCIkAhP6i7JIyeTqsLym0xzI" />
                        <div className="aspect-square rounded-lg bg-surface-container-highest flex items-center justify-center text-xs font-bold text-on-surface-variant cursor-pointer hover:bg-surface-variant transition-colors">
                            +12
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/10">
                    <button className="w-full flex items-center gap-3 text-sm text-error font-bold px-2 py-3 hover:bg-error-container/10 rounded-xl transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">block</span>
                        <span>Chặn người dùng</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ConversationDetails;
