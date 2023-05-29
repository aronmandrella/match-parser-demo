/*
	Alternative less "K.I.S.S" approach.
	
	It could turn out to be better, if there are a LOT of sport types to manage.

	Depending on a use case, it could even make sense to 
	define `Match` schema and formatter config in one place.

	Perhaps something like this:
	```
		const CONFIG = {
			"soccer": {
				scoreSchema: ...,
				formatName: (match) => { return "" }; 
				formatScore: (match) => { return match.score }; // Infers score type
			},
			{
				...
			}.
		} satisfies {Some TS magic here}
	```
*/
import type { Match } from "./parseMatch";

export type FormattedMatch = {
	name: string;
	score: string;
};

const CONFIG: {
	[TSport in Match["sport"]]: {
		participantSeparator: "-" | "vs";
		formatScore: (match: Match & { sport: TSport }) => string;
	};
} = {
	soccer: {
		participantSeparator: "-",
		formatScore: (m) => {
			return m.score;
		}
	},
	basketball: {
		participantSeparator: "-",
		formatScore: ({ score }) => {
			return `${score[0][0]},${score[0][1]},${score[1][0]},${score[1][1]}`;
		}
	},
	handball: {
		participantSeparator: "vs",
		formatScore: (m) => {
			return m.score;
		}
	},
	tennis: {
		participantSeparator: "vs",
		formatScore: (m) => {
			const [mainScore, set1, set2, set3] = m.score.split(",");
			return `Main score: ${mainScore} (set1 ${set1}, set2 ${set2}, set3 ${set3})`;
		}
	},
	volleyball: {
		participantSeparator: "-",
		formatScore: (m) => {
			const [mainScore, set1, set2, set3] = m.score.split(",");
			return `Main score: ${mainScore} (set1 ${set1}, set2 ${set2}, set3 ${set3})`;
		}
	}
};

export function formatMatch_alt(match: Match): FormattedMatch {
	const config = CONFIG[match.sport];
	const participantSeparator = config.participantSeparator;

	// Some harmless TS lie here to avoid unnecessarily complex generics
	const formatScore = config.formatScore as (match: Match) => string;

	const formattedName = `${match.participant1} ${participantSeparator} ${match.participant2}`;
	const formattedScore = formatScore(match);

	return { name: formattedName, score: formattedScore };
}
