export type DatabaseId = number;

export type Personal = {
  id: DatabaseId;
  name: string;
  title: string;
  university: string;
  faculty: string;
  bio: string;
  photo: string | null;
  photo_url: string | null;
  location: string;
  quote: string;
  cv_file: string | null;
  cv_url: string | null;
  status: string;
  created_at?: string | null;
  updated_at?: string | null;
};

export type SkillCategory = "tech" | "hard" | "soft";

export type Skill = {
  id: DatabaseId;
  name: string;
  category: SkillCategory;
  icon: string | null;
  proficiency: number | null;
  sort_order: number;
  is_visible: boolean;
};

export type ProjectTag = {
  id: DatabaseId;
  project_id: DatabaseId;
  tag: string;
};

export type Project = {
  id: DatabaseId;
  title: string;
  category: string;
  description: string;
  thumbnail: string | null;
  thumbnail_url: string | null;
  demo_url: string | null;
  repo_url: string | null;
  year: number | null;
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
  tags: ProjectTag[];
};

export type Certificate = {
  id: DatabaseId;
  title: string;
  issuer: string;
  credential_id: string | null;
  credential_url: string | null;
  image: string | null;
  image_url: string | null;
  year: number;
  is_visible: boolean;
  sort_order: number;
};

export type ExperienceType = "fulltime" | "parttime" | "internship" | "freelance" | "organization";
export type ExperienceCategory = "work" | "education" | "organization" | "achievement";

export type Experience = {
  id: DatabaseId;
  company: string;
  position: string;
  type: ExperienceType;
  category: ExperienceCategory;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string;
  location: string | null;
  is_visible: boolean;
  sort_order: number;
};

export type Contact = {
  id: DatabaseId;
  platform: string;
  label: string;
  value: string;
  icon: string | null;
  is_visible: boolean;
  sort_order: number;
};

export type PortfolioData = {
  personal: Personal | null;
  skills: Record<SkillCategory, Skill[]>;
  projects: Project[];
  certificates: Certificate[];
  experiences: Experience[];
  contacts: Contact[];
};

export type DashboardData = {
  personal: Personal | null;
  skills: Skill[];
  projects: Project[];
  certificates: Certificate[];
  experiences: Experience[];
  contacts: Contact[];
};
