export type TabId = 'overview' | 'features' | 'docs';

export interface ErrorEvent {
  id: string;
  type: string;
  message: string;
  filePath: string;
  line: number;
  fingerprint: string;
  events: number;
  lastSeen: string;
  timestamp: Date;
  status: 'unresolved' | 'ignored' | 'resolved';
  environment: 'production' | 'staging';
}

export interface Project {
  id: string;
  name: string;
  alertsEnabled: boolean;
}

export interface ContributionIssue {
  id: string;
  title: string;
  type: 'bug' | 'feature' | 'refactor';
  status: 'open' | 'merged' | 'closed';
  author: string;
  votes: number;
}
