// lib/utils/validations.ts
import { z } from 'zod';

export const classifyRequestSchema = z.object({
  complaintText: z.string().min(10, "Complaint text must be at least 10 characters long").max(2000)
});

export const similarityRequestSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string(),
  ward: z.string()
});

export const reputationUpdateSchema = z.object({
  userId: z.string().uuid(),
  action: z.enum([
    'SUBMIT_VALID_COMPLAINT',
    'HIGH_IMPACT_COMPLAINT',
    'VERIFIED_DANGEROUS',
    'CONFIRM_RESOLUTION',
    'FAKE_COMPLAINT',
    'SPAM_BEHAVIOR'
  ])
});

export const aiAnalyzeSchema = z.object({
  text: z.string().min(5),
  hasMedia: z.boolean().default(false),
});

export const trustScoreSchema = z.object({
  complaintId: z.string().uuid().optional(),
  textLength: z.number(),
  hasMedia: z.boolean(),
  userReputation: z.number().default(50),
});

export const duplicateCheckSchema = z.object({
  text: z.string(),
  ward: z.string(),
  category: z.string(),
});
