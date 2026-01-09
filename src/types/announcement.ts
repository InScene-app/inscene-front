export interface Author {
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
  contractType: 'contract' | 'full-time' | 'internship' | 'part-time';
  imageUrl: string | null;
  exactSalary?: number;
  minSalary?: number;
  maxSalary?: number;
}
