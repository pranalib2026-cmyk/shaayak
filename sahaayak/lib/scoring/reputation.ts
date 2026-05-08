// lib/scoring/reputation.ts

export type ReputationAction = 
  | 'SUBMIT_VALID_COMPLAINT'
  | 'HIGH_IMPACT_COMPLAINT'
  | 'VERIFIED_DANGEROUS'
  | 'CONFIRM_RESOLUTION'
  | 'FAKE_COMPLAINT'
  | 'SPAM_BEHAVIOR';

export const ACTION_POINTS: Record<ReputationAction, number> = {
  'SUBMIT_VALID_COMPLAINT': 10,
  'HIGH_IMPACT_COMPLAINT': 20,
  'VERIFIED_DANGEROUS': 30,
  'CONFIRM_RESOLUTION': 15,
  'FAKE_COMPLAINT': -20,
  'SPAM_BEHAVIOR': -10
};

export function getTrustTier(points: number): string {
  if (points >= 701) return 'Platinum Karnataka Guardian';
  if (points >= 301) return 'Gold Civic Leader';
  if (points >= 101) return 'Silver Contributor';
  return 'Bronze Citizen';
}

export function checkAchievements(points: number, stats: any): string[] {
  const newBadges: string[] = [];
  
  if (points >= 100) newBadges.push('Civic Hero');
  if (points >= 500) newBadges.push('Karnataka Guardian');
  
  if (stats.roadsReported >= 5) newBadges.push('Road Guardian');
  if (stats.waterReported >= 5) newBadges.push('Water Watcher');
  if (stats.electricityReported >= 5) newBadges.push('Electricity Protector');
  
  return newBadges;
}
