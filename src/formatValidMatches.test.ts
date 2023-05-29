import { describe, expect, it } from "@jest/globals";
import { exampleValidMatches, exampleValidMatchesResult } from "../examples";
import { formatValidMatches } from "./formatValidMatches";

describe("formatValidMatches", () => {
	it("should correctly format all valid matches and omit invalid ones", () => {
		// @ts-expect-error should warn about wrong type
		const result = formatValidMatches([...exampleValidMatches, { sport: "ski jumping" }]);

		expect(result).toStrictEqual(exampleValidMatchesResult);
	});
});
