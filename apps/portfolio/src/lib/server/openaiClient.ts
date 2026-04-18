import OpenAI from 'openai';
import { ENV } from 'varlock/env';

const openai = new OpenAI({
	apiKey: ENV.OPENAI_API_KEY,
});

export { openai };
