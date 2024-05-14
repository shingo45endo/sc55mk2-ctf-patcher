export function modifyToneTable(allBytes) {
	console.assert(allBytes instanceof Uint8Array);

	// Reads original tone tables.
	const bytes = allBytes.subarray(0x030000, 0x038000);
	const tableTones = convertToUint16BEArray(bytes).reduce((p, _, i, a) => {
		if (i % 128 === 0) {
			p.push(a.slice(i, i + 128));
		}
		return p;
	}, []);

	// Modifies the tone tables to support "Alternate Voicings".
	const toneNos = [];
	for (let bankM = 0; bankM < 64; bankM++) {	// BankM #64 and above shall not be subject to fallback because they are special use areas.
		const tones = convertToUint16BEArray(bytes.slice(bankM * 256, (bankM + 1) * 256));
		const newTones = tones.map((toneNo, prog) => {
			if (toneNo !== 0xffff || prog >= 120) {	// Prog #121 (internally #120) and above shall not be subject to fallback because they are special-effects sounds.
				return toneNo;
			} else {
				const subCapitalTone = tableTones[bankM & 0x78][prog];
				if (subCapitalTone !== 0xffff) {
					return subCapitalTone;
				} else {
					return tableTones[0][prog];
				}
			}
		});
		toneNos.push(...newTones);
	}

	// Writes back the modified tone tables.
	bytes.set(convertToBytes(toneNos));
}

export function modifyDrumTable(allBytes) {
	console.assert(allBytes instanceof Uint8Array);

	// Reads an original drum table.
	const tableDrumSets = allBytes.subarray(0x038000, 0x038080);

	// Modifies the drum table to support "Alternate Voicings".
	const newTableDrumSets = tableDrumSets.map((drumSetNo, prog) => {
		if (drumSetNo !== 0xff || prog >= 64) {	// Note: "64": SC-55 v1.00-1.21 / "48": SC-55 v2.00
			return drumSetNo;
		} else {
			return tableDrumSets[prog & 0x78];
		}
	});

	// Writes back the modified drum table.
	tableDrumSets.set(newTableDrumSets);
}

function convertToUint16BEArray(bytes) {
	console.assert(bytes instanceof Uint8Array && bytes.length % 2 === 0);

	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const u16s = [];
	for (let i = 0; i < bytes.length; i += 2) {
		u16s.push(view.getUint16(i, false));
	}

	return u16s;
}

function convertToBytes(u16s) {
	console.assert(u16s?.length && u16s.every((u16) => (0 <= u16 && u16 < 0x10000)));

	const bytes = new Uint8Array(u16s.length * 2);
	const view = new DataView(bytes.buffer);
	for (let i = 0; i < u16s.length; i++) {
		view.setUint16(i * 2, u16s[i], false);
	}

	return bytes;
}
