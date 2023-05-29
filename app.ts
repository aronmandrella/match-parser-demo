import { exampleValidMatches } from "./examples";
import { formatValidMatches } from "./src/formatValidMatches";

const input = [...exampleValidMatches, { sport: "ski jumping" }];

// @ts-expect-error should warn about wrong type
const output = formatValidMatches(input);

console.log(output);
