import api from './client';
import { Announcement } from '../types/announcement';

interface AnnouncementResponse {
  id: number;
  description: string;
  title?: string;
  author?: {
    id: number;
    email: string;
    description?: string;
    avatarUrl?: string;
  };
  createdAt: string;
  tags?: string[];
  location?: string;
  candidatesCount: number;
  contractType: 'full-time' | 'part-time' | 'contract' | 'internship';
  exactSalary?: number;
  minSalary?: number;
  maxSalary?: number;
  isUrgent: boolean;
  missionDetails?: string;
  advantages?: string;
  process?: string;
  profileRequired?: string;
  skillsRequired?: string[];
  status: 'published' | 'draft' | 'scheduled' | 'archived';
  scheduledAt?: string;
  pinned: boolean;
}

/**
 * Transforme une réponse API en objet Announcement pour le front
 */
function transformAnnouncementResponse(response: AnnouncementResponse): Announcement {
  return {
    id: response.id,
    title: response.title || 'Sans titre',
    description: response.description,
    author: {
      name: response.author?.email.split('@')[0] || 'Anonyme', // Utilise l'email comme nom temporaire
      avatar: response.author?.avatarUrl || null,
    },
    createdAt: new Date(response.createdAt),
    tags: response.tags || [],
    location: response.location || 'Non spécifié',
    isUrgent: response.isUrgent,
    contractType: response.contractType === 'contract' ? 'prestation' : response.contractType,
    imageUrl: null, // Pas d'images pour l'instant
    exactSalary: response.exactSalary,
    minSalary: response.minSalary,
    maxSalary: response.maxSalary,
    applicantsCount: response.candidatesCount,
  };
}

/**
 * Récupère toutes les annonces publiées
 */
export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const response = await api.get<AnnouncementResponse[]>('/announcement');
    return response.data.map(transformAnnouncementResponse);
  } catch (error) {
    console.error('Erreur lors de la récupération des annonces:', error);
    throw error;
  }
}

/**
 * Récupère une annonce par son ID
 */
export async function getAnnouncementById(id: number): Promise<Announcement> {
  try {
    const response = await api.get<AnnouncementResponse>(`/announcement/${id}`);
    return transformAnnouncementResponse(response.data);
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'annonce ${id}:`, error);
    throw error;
  }
}

/**
 * Crée une nouvelle annonce
 */
export async function createAnnouncement(data: Partial<AnnouncementResponse>): Promise<Announcement> {
  try {
    const response = await api.post<AnnouncementResponse>('/announcement', data);
    return transformAnnouncementResponse(response.data);
  } catch (error) {
    console.error('Erreur lors de la création de l\'annonce:', error);
    throw error;
  }
}
