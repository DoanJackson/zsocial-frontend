import React from 'react';

function Avatar({ src, name, size = 40, className = '' }) {
    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className={`rounded-full object-cover flex-shrink-0 ${className}`}
                style={{ width: size, height: size }}
            />
        );
    }
    const initial = name?.[0]?.toUpperCase() || '?';
    const colors = ['#1877f2', '#00b09b', '#e67e22', '#8e44ad', '#e74c3c', '#16a085'];
    const colorIdx = (name?.charCodeAt(0) || 0) % colors.length;
    return (
        <div
            className={`rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}
            style={{ width: size, height: size, backgroundColor: colors[colorIdx], fontSize: size * 0.4 }}
        >
            {initial}
        </div>
    );
}

export default Avatar;
