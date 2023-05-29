import z from "zod";

const scoreRegEx = /^[0-9]+:[0-9]+$/u;

export const scoreSchema = {
	string: () => {
		return z.string().refine(
			(val) => {
				return scoreRegEx.test(val);
			},
			(val) => {
				return { message: `Not a valid score string: '${val}'` };
			}
		);
	},

	multiString: (count: number) => {
		if (!Number.isInteger(count) || count <= 1) {
			throw new TypeError(`Not an integer greater than one: ${count}`);
		}

		return z.string().refine(
			(val) => {
				const scores = val.split(",");
				return scores.length === count && scores.every((score) => scoreRegEx.test(score));
			},
			(val) => {
				return { message: `Not a comma separated list of ${count} scores: '${val}'` };
			}
		);
	},

	tuple2x2: () => {
		const scoreString = scoreSchema.string();

		return z.tuple([
			z.tuple([scoreString, scoreString]),
			z.tuple([scoreString, scoreString])
		]);
	}
} as const;

function createMatchSchema<
	TSport extends string,
	TScoreSchema extends z.ZodTypeAny
>(options: { sport: TSport; score: TScoreSchema }) {
	const { sport: sportName, score: scoreSchema } = options;

	return z.object({
		sport: z.literal(sportName),
		participant1: z.string().min(1),
		participant2: z.string().min(1),
		score: scoreSchema
	});
}

export const matchSchema = z.discriminatedUnion("sport", [
	createMatchSchema({
		sport: "soccer",
		score: scoreSchema.string()
	}),
	createMatchSchema({
		sport: "handball",
		score: scoreSchema.string()
	}),
	createMatchSchema({
		sport: "tennis",
		score: scoreSchema.multiString(4)
	}),
	createMatchSchema({
		sport: "volleyball",
		score: scoreSchema.multiString(4)
	}),
	createMatchSchema({
		sport: "basketball",
		score: scoreSchema.tuple2x2()
	})
]);

export type Match = z.infer<typeof matchSchema>;

/**
 * Fully validates data of provided match.
 * It assumes that data can't be trusted at all
 * (for example that it was sent by client to some REST endpoint).
 * @throws {Error | z.ZodError} If match data is not valid.
 */
export function parseMatch(match: unknown): Match {
	try {
		return matchSchema.parse(match);
	} catch (error) {
		throw new Error(`Invalid match data: ${JSON.stringify(match)}`);
	}
}
