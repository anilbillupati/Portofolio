import type { Profile } from '@/types/portfolio';

export type SocialKey = keyof Profile['links'];

/** Display order, labels and editor placeholders for every profile link. */
export const SOCIALS: { key: SocialKey; label: string; placeholder: string }[] = [
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://www.linkedin.com/in/…' },
  { key: 'github', label: 'GitHub', placeholder: 'https://github.com/…' },
  { key: 'leetcode', label: 'LeetCode', placeholder: 'https://leetcode.com/u/…' },
  { key: 'hackerrank', label: 'HackerRank', placeholder: 'https://www.hackerrank.com/profile/…' },
];

/** The profile's links that are filled in, in display order. */
export function socialLinks(profile: Profile): { key: SocialKey; label: string; href: string }[] {
  return SOCIALS.filter((s) => profile.links[s.key]).map((s) => ({ key: s.key, label: s.label, href: profile.links[s.key] }));
}
