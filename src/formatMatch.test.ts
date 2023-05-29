import { describe, expect, it } from "@jest/globals";
import { exampleValidMatches, exampleValidMatchesResult } from "../examples";
import { FormattedMatch, formatMatch } from "./formatMatch";
import { Match } from "./parseMatch";

describe("formatMatch", () => {
	const sports = [...new Set(exampleValidMatches.map((m) => m.sport))];

	it.each(sports)("should correctly format '%s' match data", (sport) => {
		const testCaseIndex = exampleValidMatches.findIndex((m) => m.sport === sport);

		const result = formatMatch(exampleValidMatches[testCaseIndex]!);
		expect(result).toStrictEqual(exampleValidMatchesResult[testCaseIndex]);
	});
});
