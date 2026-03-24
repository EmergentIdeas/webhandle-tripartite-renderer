
	import {tripartite} from "tripartite"
	
	let one = tripartite.addTemplate('one', 'hello, __name__!')

	console.log(one({name: 'Dan'}))
	
	tripartite.loadTemplate('json', (template) => {

		console.log(template({name: 'Dan'}))
	})
	let template = await tripartite.loadTemplateAsync('json')
	console.log(template({name: 'Paul'}))