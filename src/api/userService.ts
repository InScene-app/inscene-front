import api from './client';
import { User } from '../types/user';

interface UserResponse {
    id: number;
    email: string;
    name?: string;
    avatarUrl?: string;
    description?: string;
    createdAt: string;
}

const mapUserResponse = (response: UserResponse): User => {
    return {
        id: response.id,
        email: response.email,
        name: response.name,
        avatarUrl: response.avatarUrl,
        description: response.description,
        createdAt: response.createdAt,
    };
};

export const getUserById = async (id: number): Promise<User> => {
    const response = await api.get<UserResponse>(`/user/${id}`);
    return mapUserResponse(response.data);
};
