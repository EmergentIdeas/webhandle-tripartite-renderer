
import test from 'node:test';
import assert from 'node:assert'
import determineTemplateName from '../determine-template-name.mjs';

test("determine template name", async (t) => {
	await t.test('determine', async (t) => {
		let name = determineTemplateName('/one/two/three', ['/one'])
		assert.equal(name, "two/three", "Template name is incorrect.")

		name = determineTemplateName('/one/two/three', ['/one/'])
		assert.equal(name, "two/three", "Template name is incorrect.")
		
		name = determineTemplateName('/one/two/three.tri', ['/one/'])
		assert.equal(name, "two/three", "Template name is incorrect.")
		
		name = determineTemplateName('/uno/two/three.tri', ['/one/', '/uno'])
		assert.equal(name, "two/three", "Template name is incorrect.")
	})
})