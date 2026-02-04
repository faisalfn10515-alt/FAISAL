
export interface Achievement {
  title: string;
  description: string;
  icon: string;
}

export interface Skill {
  name: string;
  level: number;
}

export interface Goal {
  title: string;
  category: 'professional' | 'creative' | 'academic';
}

export interface Feedback {
  rating: number;
  comment: string;
  userName: string;
  userAge: string;
  userJob: string;
}

// Added GameType to fix "Cannot find name 'GameType'" error in App.tsx
export type GameType = 'runner' | 'memory' | 'reaction' | 'smasher' | 'collector';
