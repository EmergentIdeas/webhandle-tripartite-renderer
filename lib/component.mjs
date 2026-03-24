import tripartite from "tripartite"

let tripartiteFoundTemplates = {}
tripartite.loaders.push((name, callback) => {
	if(name in tripartiteFoundTemplates) {
		return callback(tripartiteFoundTemplates[name])
	}
	let el = document.querySelector(`template[data-tripartite-template="${name}"]`)
	if(el) {
		let txt = el.innerHTML
		let encoding = el.getAttribute('data-encoding')
		if(encoding) {
			if(encoding === 'uri') {
				txt = decodeURIComponent(txt)
			}
			else {
				console.error(`Could not decode template: ${name}`)
				txt = null
			}
		}
		tripartiteFoundTemplates[name] = txt
	}
	else {
		tripartiteFoundTemplates[name] = undefined
	}
	callback(tripartiteFoundTemplates[name])

})

export {tripartite, tripartiteFoundTemplates}