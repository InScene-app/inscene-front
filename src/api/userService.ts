import api from './client';
import { User, SocialNetwork, UserFile, Job } from '../types/user';

export interface Category {
    id: number;
    name: string;
    jobs: { code: string; name: string }[];
}

interface UserResponse {
    id: number;
    email: string;
    type?: string;
    role?: string;
    name?: string;
    avatarUrl?: string;
    description?: string;
    createdAt: string;
    isActive?: boolean;
    socialLinks?: string[];
    location?: string[];
    socialNetworks?: SocialNetwork[];

    // Files
    files?: UserFile[];
    pictures?: UserFile[];
    videos?: UserFile[];

    // Individual fields
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    experience?: string;
    jobs?: Job[];

    // Enterprise fields
    enterpriseName?: string;
    address?: string;
    culture?: string;
    activities?: string;
    practicalInfo?: string;
    websiteUrl?: string;
    contactNumber?: string;
}

const mapUserResponse = (response: UserResponse): User => {
    return {
        id: response.id,
        email: response.email,
        type: response.type,
        role: response.role,
        name: response.name,
        avatarUrl: response.avatarUrl,
        description: response.description,
        createdAt: response.createdAt,
        isActive: response.isActive,
        socialLinks: response.socialLinks,
        location: response.location,
        socialNetworks: response.socialNetworks,

        // Files
        files: response.files,
        pictures: response.pictures,
        videos: response.videos,

        // Individual fields
        firstName: response.firstName,
        lastName: response.lastName,
        dateOfBirth: response.dateOfBirth,
        experience: response.experience,
        jobs: response.jobs,

        // Enterprise fields
        enterpriseName: response.enterpriseName,
        address: response.address,
        culture: response.culture,
        activities: response.activities,
        practicalInfo: response.practicalInfo,
        websiteUrl: response.websiteUrl,
        contactNumber: response.contactNumber,
    };
};

export const getUserById = async (id: number): Promise<User> => {
    const response = await api.get<UserResponse>(`/user/${id}`);
    return mapUserResponse(response.data);
};

export const updateIndividual = async (id: number, data: Record<string, unknown>): Promise<void> => {
    await api.patch(`/individual/${id}`, data);
};

export const uploadUserMedia = async (userId: number, file: File, category: string): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    await api.post(`/user/${userId}/media`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/category');
    return response.data;
};

export const followUser = async (userId: number, targetId: number): Promise<void> => {
    await api.post(`/user/${userId}/follow/${targetId}`);
};

export const unfollowUser = async (userId: number, targetId: number): Promise<void> => {
    await api.delete(`/user/${userId}/follow/${targetId}`);
};

export const getFollowingIds = async (userId: number): Promise<number[]> => {
    const response = await api.get(`/user/${userId}/following`);
    return (response.data || []).map((u: any) => u.id);
};
