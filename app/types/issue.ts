export interface IssueFilter {
  status?: string;
  priority?: string;
  department?: string;
  assignedToId?: string;
  createdById?: string;
  issueType?: string;
  search?: string;
}

export interface IssueSort {
  field: string;
  order: 'asc' | 'desc';
}

export enum IssueStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum Department {
  PRODUCTION = '생산',
  QUALITY = '품질',
  MAINTENANCE = '유지보수',
  SAFETY = '안전'
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: Priority;
  department: Department;
  issueType: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  createdBy: {
    id: string;
    name: string;
    email: string;
    companyId: string;
    department?: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  solution?: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    email?: string;
  };
} 