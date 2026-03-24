import createCompositeLoader from "@webhandle/core/lib/loaders/create-composite-loader.mjs"

export default function createRenderTemplateSource(resTri) {
	let renderTemplateSource = function() {}
	renderTemplateSource.write = (thedata, stream, callback) => {
		if(!renderTemplateSource.compositeLoader) {
			renderTemplateSource.compositeLoader = createCompositeLoader(...resTri.loaders)
		}
		if(!renderTemplateSource.renderedTemplates) {
			renderTemplateSource.renderedTemplates = new Set()
		}
		if(typeof thedata === 'string') {
			thedata = [thedata]
		}
		if(Array.isArray(thedata)) {
			function addTemplate() {
				if(thedata.length > 0) {
					let templateName = thedata.pop()
					if(renderTemplateSource.renderedTemplates.has(templateName)) {
						return addTemplate()
					}
					renderTemplateSource.renderedTemplates.add(templateName)
					renderTemplateSource.compositeLoader(templateName, (template) => {
						if(template) {
							let content = `<template data-tripartite-template="${templateName}" data-encoding="uri">${encodeURIComponent(template)}</template>`
							stream.write(content.toString(), "UTF-8", () => {
								addTemplate()
							})
								
							return
						}
						addTemplate()
					})
				}
				else {
					if(callback) {
						callback()
					}
				}
			}
			addTemplate()
		}
		else {
			if(callback) {
				callback()
			}
		}
	}
			
	return renderTemplateSource
}