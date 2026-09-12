export interface Chapter {
  id: string;
  num: string;
  title: string;
  stageIdx: number;
  scripture: string;
  scriptureRef: string;
  content: string[];
  reflection: string;
}

export interface GrowthStage {
  id: string;
  label: string;
  sub: string;
}

export type ActiveTab = 'home' | 'library' | 'audio' | 'journal' | 'apk' | 'about';

export interface PWAInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}
