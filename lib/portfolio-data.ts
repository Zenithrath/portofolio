import { createSupabasePublicClient } from "@/lib/supabase/public";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  Certificate,
  Contact,
  DashboardData,
  Experience,
  Personal,
  PortfolioData,
  Project,
  ProjectTag,
  Skill,
} from "@/types/portfolio";

const EMPTY_PORTFOLIO: PortfolioData = {
  personal: null,
  skills: { tech: [], hard: [], soft: [] },
  projects: [],
  certificates: [],
  experiences: [],
  contacts: [],
};

function publicUrl(path: string | null | undefined) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const supabase = createSupabasePublicClient();
  return supabase?.storage.from("portfolio").getPublicUrl(path).data.publicUrl ?? null;
}

function mapPersonal(row: Omit<Personal, "photo_url" | "cv_url"> | null): Personal | null {
  if (!row) return null;
  return { ...row, photo_url: publicUrl(row.photo), cv_url: publicUrl(row.cv_file) };
}

function mapProject(row: Omit<Project, "thumbnail_url" | "tags"> & { project_tags?: ProjectTag[] | null }): Project {
  return {
    ...row,
    thumbnail_url: publicUrl(row.thumbnail),
    tags: row.project_tags ?? [],
  };
}

function mapCertificate(row: Omit<Certificate, "image_url">): Certificate {
  return { ...row, image_url: publicUrl(row.image) };
}

async function loadPortfolioData(): Promise<PortfolioData> {
  const supabase = createSupabasePublicClient();
  if (!supabase) return EMPTY_PORTFOLIO;

  const [personalResult, skillsResult, projectsResult, certificatesResult, experiencesResult, contactsResult] = await Promise.all([
    supabase.from("personals").select("*").limit(1).maybeSingle(),
    supabase.from("skills").select("*").eq("is_visible", true).order("sort_order"),
    supabase.from("projects").select("*, project_tags(*)").eq("is_visible", true).order("sort_order"),
    supabase.from("certificates").select("*").eq("is_visible", true).order("sort_order"),
    supabase.from("experiences").select("*").eq("is_visible", true).order("sort_order"),
    supabase.from("contacts").select("*").eq("is_visible", true).order("sort_order"),
  ]);

  if ([personalResult, skillsResult, projectsResult, certificatesResult, experiencesResult, contactsResult].some((result) => result.error)) {
    console.error("Unable to load portfolio data", {
      personal: personalResult.error?.message,
      skills: skillsResult.error?.message,
      projects: projectsResult.error?.message,
      certificates: certificatesResult.error?.message,
      experiences: experiencesResult.error?.message,
      contacts: contactsResult.error?.message,
    });
  }

  const groupedSkills = { tech: [], hard: [], soft: [] } as PortfolioData["skills"];
  for (const skill of (skillsResult.data ?? []) as Skill[]) {
    if (skill.category in groupedSkills) groupedSkills[skill.category].push(skill);
  }

  return {
    personal: mapPersonal(personalResult.data as Omit<Personal, "photo_url" | "cv_url"> | null),
    skills: groupedSkills,
    projects: ((projectsResult.data ?? []) as (Omit<Project, "thumbnail_url" | "tags"> & { project_tags?: ProjectTag[] | null })[]).map(mapProject),
    certificates: ((certificatesResult.data ?? []) as Omit<Certificate, "image_url">[]).map(mapCertificate),
    experiences: (experiencesResult.data ?? []) as Experience[],
    contacts: (contactsResult.data ?? []) as Contact[],
  };
}

export async function getPortfolioData(): Promise<PortfolioData> {
  return loadPortfolioData();
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ...EMPTY_PORTFOLIO, skills: [] };

  const [personalResult, skillsResult, projectsResult, certificatesResult, experiencesResult, contactsResult] = await Promise.all([
    supabase.from("personals").select("*").limit(1).maybeSingle(),
    supabase.from("skills").select("*").order("sort_order"),
    supabase.from("projects").select("*, project_tags(*)").order("sort_order"),
    supabase.from("certificates").select("*").order("sort_order"),
    supabase.from("experiences").select("*").order("sort_order"),
    supabase.from("contacts").select("*").order("sort_order"),
  ]);

  return {
    personal: mapPersonal(personalResult.data as Omit<Personal, "photo_url" | "cv_url"> | null),
    skills: (skillsResult.data ?? []) as Skill[],
    projects: ((projectsResult.data ?? []) as (Omit<Project, "thumbnail_url" | "tags"> & { project_tags?: ProjectTag[] | null })[]).map(mapProject),
    certificates: ((certificatesResult.data ?? []) as Omit<Certificate, "image_url">[]).map(mapCertificate),
    experiences: (experiencesResult.data ?? []) as Experience[],
    contacts: (contactsResult.data ?? []) as Contact[],
  };
}
