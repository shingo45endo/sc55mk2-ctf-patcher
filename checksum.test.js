import assert from 'node:assert/strict';
import test from 'node:test';

import {updateChecksum} from './ctf_patcher.js';

function wordSum(bytes) {
	let sum = 0;
	for (let i = 0; i < bytes.length; i += 2) {
		sum = (sum + (bytes[i] << 8) + bytes[i + 1]) & 0xffff;
	}
	return sum;
}

test('updates the final word to make the complete ROM sum zero', () => {
	const rom = Uint8Array.from([0x12, 0x34, 0xab, 0xcd, 0xff, 0xff]);
	assert.equal(updateChecksum(rom), 0x41ff);
	assert.deepEqual([...rom], [0x12, 0x34, 0xab, 0xcd, 0x41, 0xff]);
	assert.equal(wordSum(rom), 0);
	assert.equal(updateChecksum(rom), 0x41ff);
});

test('rejects an odd-sized ROM', () => {
	assert.throws(() => updateChecksum(new Uint8Array(3)), /even number of bytes/);
});
