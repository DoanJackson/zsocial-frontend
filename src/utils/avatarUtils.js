export function getUserAvatarUrl() {
    const avatarUrl = localStorage.getItem('avatarUrl');
    return avatarUrl || '/assets/default-avatar.png';
}

export function getDefaultAvatarUrl() {
    return '/assets/default-avatar.png';
}