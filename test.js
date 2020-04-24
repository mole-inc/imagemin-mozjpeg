const fs = require('fs');
const path = require('path');
const isJpg = require('is-jpg');
const isProgressive = require('is-progressive');
const test = require('ava');
const {promisify} = require('util');

const m = require('.');
const readFileP = promisify(fs.readFile);

test('optimize a JPG', async t => {
	const buf = await readFileP(path.join(__dirname, 'fixture.jpg'));
	const data = await m()(buf);

	t.true(data.length < buf.length);
	t.true(isJpg(data));
	t.true(isProgressive.buffer(data));
});

test('support mozjpeg options', async t => {
	const buf = await readFileP(path.join(__dirname, 'fixture.jpg'));
	const data = await m({progressive: false})(buf);

	t.false(isProgressive.buffer(data));
});

test('skip optimizing a non-JPG file', async t => {
	const buf = await readFileP(__filename);
	const data = await m()(buf);

	t.deepEqual(data, buf);
});

test('throw error when a JPG is corrupt', async t => {
	const buf = await readFileP(path.join(__dirname, 'fixture-corrupt.jpg'));
	await t.throwsAsync(async () => {
		await m()(buf);
	}, {instanceOf: Error, message: /Corrupt JPEG data/});
});
