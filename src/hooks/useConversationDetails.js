import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import chatService from '@/services/chatService';

export const useConversationDetails = (conversationId) => {
    const [members, setMembers] = useState(null);
    const [showMembers, setShowMembers] = useState(false);
    const [loadingMembers, setLoadingMembers] = useState(false);

    const handleToggleMembers = async () => {
        if (showMembers) { 
            setShowMembers(false); 
            return; 
        }
        if (members) { 
            setShowMembers(true); 
            return; 
        }
        setLoadingMembers(true);
        try {
            const res = await chatService.getMembers(conversationId);
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
    }, [conversationId]);

    return {
        members,
        showMembers,
        loadingMembers,
        handleToggleMembers
    };
};
