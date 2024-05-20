import fs from 'node:fs';
import util from 'node:util';
import process from 'node:process';
import assert from 'node:assert';

import {modifyToneTable, modifyDrumTable} from './ctf_patcher.js';

console.assert = assert;

const options = {
	tone: {type: 'string', choices: ['thru', 'strict-sc55', 'sc55', 'sc55mk2']},
	drum: {type: 'string', choices: ['thru', 'sc55v1', 'sc55v2']},
};

try {
	// Parses the arguments.
	const {values, positionals: [inputFile, outputFile]} = util.parseArgs({
		args: process?.args ?? globalThis.Deno?.args,
		allowPositionals: true,
		options,
	});

	// Checks the arguments.
	if (!inputFile) {
		throw new Error('Input file is not specified.');
	}
	for (const option of Object.keys(options)) {
		const choices = options[option].choices;
		if (values[option] && choices && !choices.includes(values[option])) {
			throw new Error(`Invalid argument: "--${option}" [choices: ${choices.map((e) => `"${e}"`).join(', ')}]`);
		}
	}

	// Reads a firmware ROM file.
	const bytes = new Uint8Array(fs.readFileSync(inputFile));

	// Checks the size of the firmware ROM.
	if (bytes.length % 0x40000 !== 0) {
		console.warn('The input file size is not the correct firmware ROM size.');
	}

	// Modifies the firmware ROM.
	if (values.tone !== 'thru') {
		modifyToneTable(bytes, values.tone);
	}
	if (values.drum !== 'thru') {
		modifyDrumTable(bytes, values.drum);
	}

	// Writes a modified firmware ROM file.
	fs.writeFileSync(outputFile ?? `${inputFile}.new`, bytes);

} catch (e) {
	console.error(`ERROR: ${e.message}`);
}
