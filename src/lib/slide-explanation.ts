import {z} from 'zod';
import {safeCitationUrl} from './search-grounding';
export const slideRequestSchema=z.object({pageId:z.string().min(3).max(80).regex(/^[a-z0-9-]+$/)}).strict();
export const slideAnswerSchema=z.object({sentences:z.array(z.string().min(8).max(260)).length(3)}).strict();
export const slideResponseSchema=slideAnswerSchema.extend({
 pageId:z.string(),model:z.literal('gemini-3.8-flash'),
 grounding:z.object({citations:z.array(z.object({title:z.string().max(180),url:z.string().refine(v=>!!safeCitationUrl(v))})).max(12),queries:z.array(z.string().max(2000)).max(6),supportCount:z.number().nonnegative(),searchEntryHtml:z.string().max(100000),searched:z.boolean()}),
});
export type SlideExplanationResult=z.infer<typeof slideResponseSchema>;
