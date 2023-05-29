import { FormattedMatch, formatMatch } from "./formatMatch";
import { Match, parseMatch } from "./parseMatch";

/**
 * Formats all provided matches. Matches with invalid data will be omitted.
 */
export function formatValidMatches(matches: Match[]) {
	const formattedMatches: FormattedMatch[] = [];

	for (const match of matches) {
		try {
			const validatedMatch = parseMatch(match);
			const formattedMatch = formatMatch(validatedMatch);

			formattedMatches.push(formattedMatch);
		} catch (error) {
			// Ignores invalid matches
		}
	}

	return formattedMatches;
}
