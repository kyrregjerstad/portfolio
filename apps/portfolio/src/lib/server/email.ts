import { ENV } from 'varlock/env';
import { z } from 'zod';

type Address = string | { address: string; name?: string };

export type SendEmailInput = {
	to: string | string[];
	from: Address;
	replyTo?: string;
	cc?: string[];
	bcc?: string[];
	subject: string;
	text?: string;
	html?: string;
};

const cfResponseSchema = z.object({
	success: z.boolean(),
	errors: z.array(z.object({ code: z.number().optional(), message: z.string() })).default([]),
	messages: z.array(z.unknown()).default([]),
	result: z
		.object({
			delivered: z.array(z.string()).default([]),
			permanent_bounces: z.array(z.string()).default([]),
			queued: z.array(z.string()).default([]),
		})
		.nullable()
		.optional(),
});

export type SendEmailData = z.infer<typeof cfResponseSchema>;

export type SendEmailError = {
	kind: 'network' | 'invalid_response' | 'send_failed';
	message: string;
	status?: number;
	errors?: { code?: number; message: string }[];
};

export type SendEmailResult =
	| { data: SendEmailData; error: null }
	| { data: null; error: SendEmailError };

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
	const { replyTo, ...rest } = input;
	const body = { ...rest, ...(replyTo ? { reply_to: replyTo } : {}) };

	let res: Response;
	try {
		res = await fetch(
			`https://api.cloudflare.com/client/v4/accounts/${ENV.CLOUDFLARE_ACCOUNT_ID}/email/sending/send`,
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${ENV.CLOUDFLARE_EMAIL_API_TOKEN}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			},
		);
	} catch (e) {
		return {
			data: null,
			error: { kind: 'network', message: e instanceof Error ? e.message : String(e) },
		};
	}

	const json = await res.json().catch(() => null);
	const parsedRes = cfResponseSchema.safeParse(json);

	if (!parsedRes.success) {
		return {
			data: null,
			error: { kind: 'invalid_response', message: 'Invalid CF response', status: res.status },
		};
	}
	if (!res.ok || !parsedRes.data.success) {
		return {
			data: null,
			error: {
				kind: 'send_failed',
				message: parsedRes.data.errors[0]?.message ?? `HTTP ${res.status}`,
				status: res.status,
				errors: parsedRes.data.errors,
			},
		};
	}
	return { data: parsedRes.data, error: null };
}
