export function getUserAvatarUrl() {
    const avatarUrl = localStorage.getItem('avatar');
    return avatarUrl || '/assets/default-avatar.png';
}

export function getDefaultAvatarUrl() {
    return '/assets/default-avatar.png';
}