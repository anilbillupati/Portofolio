import type { SocialKey } from '@/lib/socials';
import { CodeIcon, GithubIcon, HackerrankIcon, LinkedinIcon } from './Icons';

const ICONS: Record<SocialKey, typeof GithubIcon> = {
  linkedin: LinkedinIcon,
  github: GithubIcon,
  leetcode: CodeIcon,
  hackerrank: HackerrankIcon,
};

export function SocialIcon({ name, size = 18 }: { name: SocialKey; size?: number }) {
  const Icon = ICONS[name];
  return <Icon size={size} />;
}
