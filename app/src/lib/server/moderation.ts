import { z } from 'zod';
import { openai } from './openaiClient';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';

const moderationResultSchema = z.object({
	isAcceptable: z.boolean(),
	reason: z.string().optional(),
	categories: z.object({
		spam: z.boolean(),
		toxic: z.boolean(),
		harassment: z.boolean(),
		hate: z.boolean(),
		sexual: z.boolean(),
		violence: z.boolean(),
		nonsense: z.boolean(),
	}),
	confidence: z.number({ description: 'A number between 0 and 1 indicating the confidence in the moderation result' }),
	suggestedAction: z.enum(['ALLOW', 'REJECT', 'REVIEW']),
});

type ModerationResult = z.infer<typeof moderationResultSchema>;

const SYSTEM_PROMPT = `
You are a content moderator for a blog comment system. Analyze the comment for:
1. Spam or promotional content
2. Toxic or inappropriate language
3. Harassment or hate speech
4. Sexual content
5. Violence
6. Nonsense or gibberish content

Provide a structured response indicating if the content is acceptable and categorize any issues found.`;

export async function moderateContent(content: string): Promise<ModerationResult> {
	const completion = await openai.beta.chat.completions.parse({
		messages: [
			{ role: 'system', content: SYSTEM_PROMPT },
			{ role: 'user', content },
		],
		model: 'gpt-4o-mini',
		response_format: zodResponseFormat(moderationResultSchema, 'moderationResult'),
	});

	const moderationResult = completion.choices[0].message.parsed;

	console.log('moderationResult', moderationResult);

	if (!moderationResult) {
		throw new Error('Failed to moderate content');
	}

	return moderationResult;
}
