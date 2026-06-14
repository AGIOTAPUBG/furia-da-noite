// Interface types for Fúria da Noite

export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  pubgId: string;
  whatsapp: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface MatchLeaderboard {
  placement: number;
  teamName: string;
  player1: string;
  player2: string;
  kills: number;
  points: number;
  mvp: boolean;
}

export interface ScrimRoom {
  scrimId: string;
  title: string;
  dateTime: string; // ISO String
  format: string; // e.g., DUO / TPP / MD3
  price: number;
  totalSlots: number;
  availableSlots: number;
  lobbyId?: string; // Revealed exactly 15m before
  lobbyPassword?: string; // Revealed exactly 15m before
  status: 'upcoming' | 'finished';
  leaderboard?: MatchLeaderboard[];
  createdAt: string;
}

export interface Inscription {
  inscriptionId: string;
  scrimId: string;
  userId: string;
  player1Username: string;
  player1PubgId: string;
  player2Username: string;
  player2PubgId: string;
  whatsapp: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentPixCode: string;
  createdAt: string;
}

export interface ProductItem {
  productId: string;
  name: string;
  description: string;
  price: number;
  type: 'digital' | 'affiliate' | 'merch';
  features: string[];
  link?: string;
  image: string;
  rating?: number;
  sizes?: string[]; // P, M, G, GG
  inventory?: number;
  visible: boolean;
  createdAt: string;
}

export interface NewsPost {
  newsId: string;
  title: string;
  excerpt: string;
  content: string; // News Details Markdown
  category: 'Patch Notes' | 'Analysis' | 'Announcement';
  image: string;
  videoUrl?: string; // Optional PUBG highlight clip URL
  author: string;
  createdAt: string;
}
