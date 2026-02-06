export interface JobListing {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  applications: number;
  shortlisted: number;
  approved: number;
  rejected: number;
  status: string;
  datePosted: string;
  requirements: string[];
}