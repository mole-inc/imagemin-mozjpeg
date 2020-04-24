'use strict';
const execa = require('execa');
const isJpg = require('is-jpg');
const mozjpeg = require('@mole-inc/mozjpeg');

module.exports = options => async buffer => {
	options = {trellis: true,
		trellisDC: true,
		overshoot: true, ...options};

	if (!Buffer.isBuffer(buffer)) {
		throw new TypeError('Expected a buffer');
	}

	if (!isJpg(buffer)) {
		return buffer;
	}

	const args = [];

	if (typeof options.quality !== 'undefined') {
		args.push('-quality', options.quality);
	}

	if (options.progressive === false) {
		args.push('-baseline');
	}

	if (options.targa) {
		args.push('-targa');
	}

	if (options.revert) {
		args.push('-revert');
	}

	if (options.fastCrush) {
		args.push('-fastcrush');
	}

	if (typeof options.dcScanOpt !== 'undefined') {
		args.push('-dc-scan-opt', options.dcScanOpt);
	}

	if (!options.trellis) {
		args.push('-notrellis');
	}

	if (!options.trellisDC) {
		args.push('-notrellis-dc');
	}

	if (options.tune) {
		args.push(`-tune-${options.tune}`);
	}

	if (!options.overshoot) {
		args.push('-noovershoot');
	}

	if (options.arithmetic) {
		args.push('-arithmetic');
	}

	if (options.dct) {
		args.push('-dct', options.dct);
	}

	if (options.quantBaseline) {
		args.push('-quant-baseline', options.quantBaseline);
	}

	if (typeof options.quantTable !== 'undefined') {
		args.push('-quant-table', options.quantTable);
	}

	if (options.smooth) {
		args.push('-smooth', options.smooth);
	}

	if (options.maxMemory) {
		args.push('-maxmemory', options.maxMemory);
	}

	if (options.sample) {
		args.push('-sample', options.sample.join(','));
	}

	const {stdout} = await execa(mozjpeg, args, {
		encoding: null,
		input: buffer,
		maxBuffer: Infinity
	});
	return stdout;
};
