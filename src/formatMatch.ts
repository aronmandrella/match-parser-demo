import type { Match } from "./parseMatch";

export type FormattedMatch = {
	name: string;
	score: string;
};

function formatMatchName(match: Match): string {
	const { sport, participant1, participant2 } = match;

	switch (sport) {
		case "soccer":
		case "volleyball":
		case "basketball": {
			return `${participant1} - ${participant2}`;
		}

		case "tennis":
		case "handball": {
			return `${participant1} vs ${participant2}`;
		}
	}
}

function formatMatchScore(match: Match): string {
	const { sport, score } = match;

	switch (sport) {
		case "soccer":
		case "handball": {
			return score;
		}

		case "tennis":
		case "volleyball": {
			const [mainScore, set1, set2, set3] = score.split(",");
			return `Main score: ${mainScore} (set1 ${set1}, set2 ${set2}, set3 ${set3})`;
		}

		case "basketball": {
			// or: `score.flat().join(",")`
			return `${score[0][0]},${score[0][1]},${score[1][0]},${score[1][1]}`;
		}
	}
}

/**
 * Formats data of provided match.
 * Doesn't perform any data validation. It assumes that provided data is trustworthy
 * (that it was validated earlier or that came from internal backend).
 */
export function formatMatch(match: Match): FormattedMatch {
	const formattedName = formatMatchName(match);
	const formattedScore = formatMatchScore(match);

	return { name: formattedName, score: formattedScore };
}
