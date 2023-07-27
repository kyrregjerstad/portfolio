import { client } from "$lib/utils/initSanity";
import { makeSafeQueryRunner } from "groqd";

export const runQuery = makeSafeQueryRunner(
	(query: string, params: Record<string, number | string> = {}) => client.fetch(query, params)
);
