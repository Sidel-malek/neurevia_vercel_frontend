import React from 'react';

/**
 * Represents a member of the leadership or project team.
 */
export interface TeamMember {
  /** Full name of the team member */
  name: string;
  /** Role or title within the organization */
  role: string;
  /** Brief biography or description */
  bio: string;
  /** Optional URL or path to profile image */
  image?: string;
}

/**
 * Represents a research publication entry.
 */
export interface Publication {
  /** Title of the paper or article */
  title: string;
  /** Name of the journal or conference */
  journal: string;
  /** Year of publication */
  year: string;
  /** Comma-separated list of authors */
  authors: string;
}

/**
 * Visibility flags for animated scroll-triggered sections.
 */
export interface VisibilityMap {
  mission: boolean;
  story: boolean;
  team: boolean;
  values: boolean;
  research: boolean;
  partners: boolean;
}

/**
 * Represents an item in the statistics section.
 */
export interface StatsItem {
  /** Icon component to display */
  icon: React.ReactNode;
  /** Numeric or textual value (e.g., "7+", "95%") */
  value: string;
  /** Label describing the stat (e.g., "Years of Research") */
  label: string;
  /** CSS transition delay (e.g., "200ms") */
  delay: string;
  /** Background utility class for icon container (e.g., "bg-blue-100") */
  bg: string;
}

/**
 * Represents a core value item.
 */
export interface ValueItem {
  /** Icon component to display */
  icon: React.ReactNode;
  /** Title of the core value */
  title: string;
  /** Description of the core value */
  description: string;
  /** CSS transition delay for animation (e.g., "400ms") */
  delay: string;
}

export interface VisibilityMap {
    [key: string]: boolean;
  }
  

/**
 * Partner names or logos for the partners section.
 */
export type Partner = string;

export type PricingOption = {
  title: string;
  description: string;
  price: string;
  period?: string;
  discount?: string;
  features: string[];
  negativeFeatures?: string[];
  buttonText: string;
  buttonLink: string[];
  icon: React.ReactNode;
  highlighted?: boolean;
  premium?: boolean;
};

export type PlanType = 'monthly' | 'yearly';


