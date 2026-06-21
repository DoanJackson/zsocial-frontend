import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDom from 'react-dom';
import reactionService from '@/services/reactionService';
import ReactorUserItem from './ReactorUserItem';
import { toast } from 'react-toastify';

const LikeListPopup = ({ isOpen, onClose, targetId, targetType }) => {
    const [reactors, setReactors] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const scrollContainerRef = useRef(null);

    const hasMoreRef = useRef(true);

    const loadReactors = useCallback(async (pageNum) => {
        if (!hasMoreRef.current && pageNum > 0) return;
        setIsLoading(true);
        try {
            const response = await reactionService.getReactors(targetId, targetType, pageNum, 10);
            const { content, totalPages } = response.data;

            if (pageNum === 0) {
                setReactors(content);
            } else {
                setReactors(prev => [...prev, ...content]);
            }

            hasMoreRef.current = pageNum + 1 < totalPages;
            setHasMore(hasMoreRef.current);
            setPage(pageNum);
        } catch (error) {
            console.error("Error loading reactors:", error);
            toast.error("Không thể tải danh sách lượt thích.");
        } finally {
            setIsLoading(false);
        }
    }, [targetId, targetType]);

    useEffect(() => {
        if (isOpen) {
            setReactors([]);
            setPage(0);
            setHasMore(true);
            hasMoreRef.current = true;
            loadReactors(0);

            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, targetId, targetType]);

    useEffect(() => {
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
            // 50px threshold
            if (scrollHeight - scrollTop - clientHeight < 50 && !isLoading && hasMore) {
                loadReactors(page + 1);
            }
        }
    };

    if (!isOpen) return null;

    // Use portal to render modal outside the current DOM hierarchy
    return ReactDom.createPortal(
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-md z-[150] flex items-end md:items-center justify-center p-0 md:p-4 transition-all"
            onClick={onClose}
        >
            <div
                className="bg-surface-container-lowest w-full md:max-w-sm max-h-[85vh] flex flex-col rounded-t-lg md:rounded-lg shadow-2xl relative overflow-hidden transition-all duration-300"
                onClick={(e) => e.stopPropagation()} // Prevent close on modal click
            >
                <header className="flex justify-between items-center px-4 w-full bg-white/70 backdrop-blur-xl sticky top-0 z-50 py-2">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                            favorite
                        </span>
                        <h1 className="font-headline font-bold text-base text-on-surface">Lượt thích</h1>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center hover:bg-slate-100/50 transition-colors active:scale-95 duration-200 rounded-full cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-on-surface-variant text-xl">close</span>
                    </button>
                </header>

                <div className="bg-slate-100 h-px w-full"></div>

                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-2 space-y-1"
                >
                    {reactors.map((reactor, idx) => (
                        <ReactorUserItem
                            key={`reactor-${reactor.user?.userId || idx}-${idx}`}
                            reactor={reactor}
                        />
                    ))}

                    {isLoading && (
                        <div className="py-4 flex justify-center">
                            <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                        </div>
                    )}

                    {!isLoading && reactors.length === 0 && (
                        <div className="text-center py-8 text-on-surface-variant text-sm font-medium">
                            Chưa có lượt thích nào.
                        </div>
                    )}

                    <div className="h-4 w-full"></div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default LikeListPopup;
