import api from './client';
import { Announcement, ContractType } from '../types/announcement';

interface AnnouncementResponse {
  id: number;
  description: string;
  title?: string;
  author?: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    enterpriseName?: string;
    description?: string;
    avatarUrl?: string;
  };
  createdAt: string;
  tags?: string[];
  location?: string;
  candidatesCount: number;
  contractType: ContractType;
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
function getAuthorName(author?: AnnouncementResponse['author']): string {
  if (!author) return 'Anonyme';
  if (author.firstName && author.lastName) {
    const first = author.firstName.charAt(0).toUpperCase() + author.firstName.slice(1);
    const last = author.lastName.charAt(0).toUpperCase() + author.lastName.slice(1);
    return `${first} ${last}`;
  }
  if (author.enterpriseName) return author.enterpriseName;
  return author.email?.split('@')[0] || 'Anonyme';
}

export function transformAnnouncementResponse(response: AnnouncementResponse): Announcement {
  return {
    id: response.id,
    title: response.title || 'Sans titre',
    description: response.description,
    author: {
      id: response.author?.id,
      name: getAuthorName(response.author),
      avatar: response.author?.avatarUrl || null,
    },
    createdAt: new Date(response.createdAt),
    tags: response.tags || [],
    location: response.location || 'Non spécifié',
    isUrgent: response.isUrgent,
    contractType: response.contractType,
    imageUrl: null, // Pas d'images pour l'instant
    exactSalary: response.exactSalary,
    minSalary: response.minSalary,
    maxSalary: response.maxSalary,
    applicantsCount: response.candidatesCount,
    missionDetails: response.missionDetails,
    advantages: response.advantages,
    process: response.process,
    profileRequired: response.profileRequired,
    skillsRequired: response.skillsRequired,
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
 * Recherche d'annonces par texte (full-text sur titre + description)
 */
export async function searchAnnouncements(query: string): Promise<Announcement[]> {
  const response = await api.get<AnnouncementResponse[]>('/announcement/search', {
    params: { query },
  });
  return response.data.map(transformAnnouncementResponse);
}

/**
 * Récupère les annonces par type de contrat
 */
export async function getAnnouncementsByContract(contractType: ContractType): Promise<Announcement[]> {
  const response = await api.get<AnnouncementResponse[]>(`/announcement/contract/${contractType}`);
  return response.data.map(transformAnnouncementResponse);
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
