import filterLog from 'filter-log'
import tripartite from 'tripartite'
let log = filterLog('webhandle', { component: 'tripartite render' })
let tri = tripartite
import createCachingLoader from '@webhandle/core/lib/loaders/create-caching-loader.mjs'
import determineTemplateName from './determine-template-name.mjs'
import createTripartiteFileLoader from "@webhandle/core/lib/loaders/create-tripartite-template-loader.mjs"
import FileSink from 'file-sink'

export default function setupTripartiteRenderer(webhandle) {
	webhandle.tripartiteTemplateLoaders = []

	webhandle.addTemplateDir = function (path, { immutable } = {}) {
		let absPath = webhandle.getAbsolutePathFromProjectRelative(path)
		let sink = new FileSink(absPath)
		let loader = createTripartiteFileLoader(sink)
		
		if(immutable === undefined) {
			immutable = !webhandle.development
		}
		
		if(immutable) {
			loader = createCachingLoader(loader, {})
		}
		this.tripartiteTemplateLoaders.push(loader)
		let info = {
			loader, sink, path: absPath, immutable
		}
		return info
	}

	webhandle.createScopedTripartite = function () {
		let scoped = tri.createBlank()
		scoped.loaders = this.tripartiteTemplateLoaders.map(loader => createCachingLoader(loader, {}))
		scoped.dataFunctions = Object.assign({}, tri.dataFunctions)

		if (this.app) {
			let viewPaths = this.app.get('views')
			if(viewPaths && Array.isArray(viewPaths) === false) {
				viewPaths = [viewPaths]
			}
			for (let viewPath of viewPaths) {
				let absPath = webhandle.getAbsolutePathFromProjectRelative(viewPath)
				let sink = new FileSink(absPath)
				let loader = createTripartiteFileLoader(sink)
				scoped.loaders.push(loader)
			}
		}

		return scoped
	}

	if (webhandle.app && webhandle.app.engine) {
		
		// define the template engine
		webhandle.app.engine('tri', async (filePath, options, callback) => { 
			let triInstance = webhandle.createScopedTripartite()
			let absViewPaths = webhandle.app.get('views').map(view => webhandle.getAbsolutePathFromProjectRelative(view))
			let name = determineTemplateName(filePath, absViewPaths)
			triInstance.loadTemplate(name, function (template) {
				if (template) {
					let data = options || {}
					template(data, function (err, content) {
						if (err) {
							log.error(err)
						}
						if (callback) {
							return callback(content)
						}
					})
				}
				else {
					if (callback) {
						return callback()
					}
				}
			})
		})

		// register the template engine
		webhandle.app.set('view engine', 'tri') 
	}

	function changeResponseForTripartite(req, res, next) {
		try {
			res.oldInternalRender = res.internalRender

			let resTri = res.tri = webhandle.createScopedTripartite()
			resTri.dataFunctions.externalResources = res.externalResources

			res.internalRender = function (name, data, callback, destination) {
				resTri.loadTemplate(name, function (template) {
					if (template) {
						data = data || res.locals
						template(data, destination, function (err) {
							if (err) {
								log.error(err)
							}
							try {
								destination.end()
							}
							catch (e) {
								log.error(e)
							}
							if (callback) {
								return callback()
							}
						})
					} else {
						res.oldInternalRender(name, data, callback)
					}
				})
			}
			next()
		}
		catch (e) {
			log.error(e)
		}
	}

	webhandle.routers.preParmParse.use(changeResponseForTripartite)

}