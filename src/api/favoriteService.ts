import api from './client';
import { parseJwt } from '../utils/jwt';

function getCurrentUserId(): number | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    const payload = parseJwt(token);
    return payload?.sub as number | null;
}

export async function getFavorites(): Promise<number[]> {
    const userId = getCurrentUserId();
    if (!userId) return [];
    const response = await api.get(`/user/${userId}/favorites`);
    return (response.data || []).map((a: any) => a.id);
}

export async function addFavorite(announcementId: number): Promise<void> {
    const userId = getCurrentUserId();
    if (!userId) return;
    await api.post(`/user/${userId}/favorites/${announcementId}`);
}

export async function removeFavorite(announcementId: number): Promise<void> {
    const userId = getCurrentUserId();
    if (!userId) return;
    await api.delete(`/user/${userId}/favorites/${announcementId}`);
}

export async function getFavoriteAnnouncements(): Promise<any[]> {
    const userId = getCurrentUserId();
    if (!userId) return [];
    const response = await api.get(`/user/${userId}/favorites`);
    return response.data || [];
}

// --- Favorite Users ---

export async function getFavoriteUserIds(): Promise<number[]> {
    const userId = getCurrentUserId();
    if (!userId) return [];
    const response = await api.get(`/user/${userId}/favorite-users`);
    return (response.data || []).map((u: any) => u.id);
}

export async function addFavoriteUser(targetUserId: number): Promise<void> {
    const userId = getCurrentUserId();
    if (!userId) return;
    await api.post(`/user/${userId}/favorite-users/${targetUserId}`);
}

export async function removeFavoriteUser(targetUserId: number): Promise<void> {
    const userId = getCurrentUserId();
    if (!userId) return;
    await api.delete(`/user/${userId}/favorite-users/${targetUserId}`);
}

export async function getFavoriteUsers(): Promise<any[]> {
    const userId = getCurrentUserId();
    if (!userId) return [];
    const response = await api.get(`/user/${userId}/favorite-users`);
    return response.data || [];
}
