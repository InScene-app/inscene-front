import { Announcement } from '../types/announcement';
import { ContractType } from '../types/announcement';

export const mockAnnouncements: Announcement[] = [
  {
    id: 1,
    title: 'Recherche monteur pour aftermovie',
    description:
      'Suite à un événement sur Lyon, nous cherchons un monteur talentueux pour réaliser un aftermovie dynamique. Dans un premier temps, nous cherchons une personne qui pourra faire une première sélection des rushes puis monter une première version.',
    author: {
      name: 'Le Grand Bornand Lyon',
      avatar: null,
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 heures ago
    tags: ['Montage', 'Audiovisuel'],
    location: 'Lyon',
    isUrgent: false,
    contractType: ContractType.PRESTATION,
    imageUrl: null,
    minSalary: 500,
    maxSalary: 800,
    applicantsCount: 12,
  },
  {
    id: 2,
    title: 'Recherche photographe pour gestion été 2025',
    description:
      'Nous recherchons un photographe talentueux et autonome pour rejoindre notre équipe au Grand Bornand et couvrir la saison estivale.',
    author: {
      name: 'Station de ski',
      avatar: null,
    },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 heures ago
    tags: ['Audiovisuel', 'Bénévolat'],
    location: 'Lyon',
    isUrgent: true,
    contractType: ContractType.CDD,
    imageUrl: null,
    exactSalary: 2500,
    applicantsCount: 34,
  },
  {
    id: 3,
    title: 'Recherche vidéaste bénévole',
    description:
      'Association recherche vidéaste bénévole pour capturer les moments forts de nos événements mensuels.',
    author: {
      name: 'Association Culturelle',
      avatar: null,
    },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 jour ago
    tags: ['Audiovisuel', 'Bénévolat'],
    location: '3ème',
    isUrgent: false,
    contractType: ContractType.BENEVOLAT,
    imageUrl: null,
    applicantsCount: 5,
  },
  {
    id: 4,
    title: 'Monteur publicitaire',
    description:
      'Agence de communication recherche monteur expérimenté pour la création de spots publicitaires créatifs et impactants.',
    author: {
      name: 'Creative Agency',
      avatar: null,
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 jours ago
    tags: ['Montage'],
    location: 'Marseille',
    isUrgent: true,
    contractType: ContractType.PRESTATION,
    imageUrl: null,
    minSalary: 1200,
    applicantsCount: 23,
  },
];
