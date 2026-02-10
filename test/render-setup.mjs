
import test from 'node:test';
import assert from 'node:assert'

import express5Setup from '@webhandle/express-5'
import listenOnHttpServer from "@webhandle/core/lib/listen-on-http-server.mjs";
import setupTripartiteRenderer from '../setup-tripartite-renderer.mjs';
import wait from "./wait.mjs"

let webhandle = await express5Setup()
listenOnHttpServer(webhandle)

setupTripartiteRenderer(webhandle)

webhandle.app.set('views', ['./test-data/views']) // specify the views directory

webhandle.routers.primary.get('/template', (req, res, next) => {
	res.locals.name = 'Daniel'
	let templateName = req.query.templateName || 'one'
	res.render(templateName)
})



test("check render results", async (t) => {
	await t.test('express render', async (t) => {
		let pr = new Promise((resolve, reject) => {
			webhandle.app.render('one', { name: 'Dan' }, (content) => {
				try {
					assert.equal(content, 'Hello, Dan!', "Rendered content was wrong.")
					resolve()
				}
				catch (e) {
					reject(e)
				}
			})

		})
		return pr
	})
	await t.test('webhandle direct render', async (t) => {
		let pr = new Promise((resolve, reject) => {
			webhandle.render('one', { name: 'Dan' }, (content) => {
				try {
					assert.equal(content, 'Hello, Dan!', "Rendered content was wrong.")
					resolve()
				}
				catch (e) {
					reject(e)
				}
			})

		})
		return pr
	})
	await t.test('fetched render', async (t) => {
		let response = await fetch('http://localhost:3000/template')
		let txt = await response.text()
		assert.equal(txt, 'Hello, Daniel!', "Rendered content was wrong.")
	})
	await t.test('fetched render with sub template', async (t) => {
		let response = await fetch('http://localhost:3000/template?templateName=two')
		let txt = await response.text()
		assert.equal(txt, `Let's call template one\n\nHello, Daniel!`, "Rendered content was wrong.")
	})

	await t.test('confirm template 3 is missing', async (t) => {
		let response = await fetch('http://localhost:3000/template?templateName=three')
		let txt = await response.text()
		assert.equal(txt, '', "Rendered content was wrong.")
	})


	webhandle.addTemplateDir('test-data/views-2', {
		immutable: true
	})

	await t.test('confirm template 3 exists', async (t) => {
		let response = await fetch('http://localhost:3000/template?templateName=three')
		let txt = await response.text()
		assert.equal(txt, 'This is template 3', "Rendered content was wrong.")
	})


	await t.test('shutdown', async (t) => {
		webhandle.server.close()
		await wait(300)
	})
})
