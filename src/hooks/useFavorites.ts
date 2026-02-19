import { useState, useEffect, useCallback } from 'react';
import { getFavorites, addFavorite, removeFavorite, getFavoriteUserIds, addFavoriteUser, removeFavoriteUser } from '../api/favoriteService';

export function useFavorites() {
    const [savedIds, setSavedIds] = useState<number[]>([]);
    const [savedUserIds, setSavedUserIds] = useState<number[]>([]);
    const [loaded, setLoaded] = useState(false);

    const isLoggedIn = !!localStorage.getItem('access_token');

    useEffect(() => {
        if (!isLoggedIn) {
            setLoaded(true);
            return;
        }
        Promise.all([
            getFavorites().catch(() => [] as number[]),
            getFavoriteUserIds().catch(() => [] as number[]),
        ]).then(([annIds, userIds]) => {
            setSavedIds(annIds);
            setSavedUserIds(userIds);
        }).finally(() => setLoaded(true));
    }, [isLoggedIn]);

    // Announcements
    const toggleSave = useCallback(async (announcementId: number) => {
        const saved = savedIds.includes(announcementId);
        setSavedIds((prev) =>
            saved ? prev.filter((id) => id !== announcementId) : [...prev, announcementId]
        );
        if (!isLoggedIn) return;
        try {
            if (saved) await removeFavorite(announcementId);
            else await addFavorite(announcementId);
        } catch {
            setSavedIds((prev) =>
                saved ? [...prev, announcementId] : prev.filter((id) => id !== announcementId)
            );
        }
    }, [savedIds, isLoggedIn]);

    const isSaved = useCallback((announcementId: number) => {
        return savedIds.includes(announcementId);
    }, [savedIds]);

    // Users
    const toggleSaveUser = useCallback(async (userId: number) => {
        const saved = savedUserIds.includes(userId);
        setSavedUserIds((prev) =>
            saved ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
        if (!isLoggedIn) return;
        try {
            if (saved) await removeFavoriteUser(userId);
            else await addFavoriteUser(userId);
        } catch {
            setSavedUserIds((prev) =>
                saved ? [...prev, userId] : prev.filter((id) => id !== userId)
            );
        }
    }, [savedUserIds, isLoggedIn]);

    const isUserSaved = useCallback((userId: number) => {
        return savedUserIds.includes(userId);
    }, [savedUserIds]);

    return { savedIds, isSaved, toggleSave, savedUserIds, isUserSaved, toggleSaveUser, loaded };
}
