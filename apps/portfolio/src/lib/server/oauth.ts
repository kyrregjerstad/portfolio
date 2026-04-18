import { GitHub } from 'arctic';
import { ENV } from 'varlock/env';

export const github = new GitHub(ENV.GITHUB_CLIENT_ID, ENV.GITHUB_CLIENT_SECRET, null);
