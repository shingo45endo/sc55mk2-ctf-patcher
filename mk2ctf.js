import fs from 'node:fs';
import process from 'node:process';
import assert from 'node:assert';

import {modifyToneTable, modifyDrumTable} from './ctf_patcher.js';

console.assert = assert;

const binFile = fs.readFileSync(process.argv[2]);
const bytes = new Uint8Array(binFile);

if (bytes.length % 0x40000 !== 0) {
	console.warn('The input file size is not the correct firmware ROM size.');
}

try {
	modifyToneTable(bytes);
	modifyDrumTable(bytes);

	fs.writeFileSync(process.argv[3] ?? `${process.argv[2]}.new`, bytes);

} catch (e) {
	console.error(`ERROR: ${e}`);
}
