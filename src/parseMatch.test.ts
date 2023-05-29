import { describe, expect, it } from "@jest/globals";
import { exampleValidMatches } from "../examples";
import { Match, parseMatch, scoreSchema } from "./parseMatch";

describe("scoreSchema", () => {
	describe("string", () => {
		it("should validate a valid score string", () => {
			const validScore = "3:2";
			const schema = scoreSchema.string();

			expect(schema.parse(validScore)).toBe(validScore);
		});

		it("should throw an error for an invalid score string", () => {
			const invalidScore = "invalid";
			const schema = scoreSchema.string();

			expect(() => schema.parse(invalidScore)).toThrow();
		});
	});

	describe("multiString", () => {
		it.each([-1, 0, 1.5])(
			"should throw when constructed with invalid count: %d",
			(count) => {
				expect(() => scoreSchema.multiString(count)).toThrow(TypeError);
			}
		);

		it("should validate a valid comma-separated score string with the correct count", () => {
			const validScore = "3:2,4:1,2:0";
			const schema = scoreSchema.multiString(3);

			expect(schema.parse(validScore)).toBe(validScore);
		});

		it("should throw an error for an invalid comma-separated score string with the incorrect count", () => {
			const invalidScore = "3:2,4:1";
			const schema = scoreSchema.multiString(3);

			expect(() => schema.parse(invalidScore)).toThrow();
		});

		it("should throw an error for an invalid comma-separated score string with an invalid score", () => {
			const invalidScore = "3:2,invalid,2:0";
			const schema = scoreSchema.multiString(3);

			expect(() => schema.parse(invalidScore)).toThrow();
		});
	});

	describe("tuple2x2", () => {
		it("should validate a valid score tuple with 2x2 scores", () => {
			const validScore = [
				["3:2", "4:1"],
				["2:0", "1:3"]
			];
			const schema = scoreSchema.tuple2x2();

			expect(schema.parse(validScore)).toStrictEqual(validScore);
		});

		it("should throw an error for an invalid sized tuple", () => {
			const invalidScore = [["3:2", "4:1"], ["2:0"]];
			const schema = scoreSchema.tuple2x2();

			expect(() => schema.parse(invalidScore)).toThrow();
		});

		it("should throw an error for an invalid score within the tuple", () => {
			const invalidScore = [
				["3:2", "invalid"],
				["2:0", "1:3"]
			];
			const schema = scoreSchema.tuple2x2();

			expect(() => schema.parse(invalidScore)).toThrow();
		});
	});
});

describe("parseMatch", () => {
	const sports = [...new Set(exampleValidMatches.map((m) => m.sport))];

	it.each(sports)("should parse valid '%s' match data correctly", (sport) => {
		for (const match of exampleValidMatches.filter((m) => m.sport === sport)) {
			const parsedMatch = parseMatch(match);
			expect(parsedMatch).toEqual(match);
		}
	});

	it("should throw an error for invalid sport name", () => {
		const invalidMatchData = {
			sport: "invalid",
			participant1: "Team A",
			participant2: "Team B",
			score: "3:2"
		};

		expect(() => {
			parseMatch(invalidMatchData);
		}).toThrow();
	});

	it("should throw an error for invalid score", () => {
		const invalidMatchData: Match = {
			sport: "soccer",
			participant1: "Team A",
			participant2: "Team B",
			score: "abc"
		};

		expect(() => {
			parseMatch(invalidMatchData);
		}).toThrow();
	});

	it("should throw an error for invalid participant", () => {
		const invalidMatchData: Match = {
			sport: "volleyball",
			// @ts-expect-error should warn about wring type
			participant1: 123,
			participant2: "Team B",
			score: "3:2,3:2,3:2"
		};

		expect(() => {
			parseMatch(invalidMatchData);
		}).toThrow();
	});

	/*
    + perhaps more tests for every sport/score combination separately
  */
});
