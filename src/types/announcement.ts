export enum ContractType {
  CDI = 'CDI',
  CDD = 'CDD',
  STAGE = 'Stage',
  ALTERNANCE = 'Alternance',
  PRESTATION = 'Prestation',
  BENEVOLAT = 'Bénévolat',
}

export interface Author {
  id?: number;
  name: string;
  avatar: string | null;
}

export interface Announcement {
  id: number;
  title: string;
  description: string;
  author: Author;
  createdAt: Date;
  tags: string[];
  location: string;
  isUrgent: boolean;
  contractType: ContractType;
  imageUrl: string | null;
  exactSalary?: number;
  minSalary?: number;
  maxSalary?: number;
  applicantsCount?: number;
  missionDetails?: string;
  advantages?: string;
  process?: string;
  profileRequired?: string;
  skillsRequired?: string[];
}
