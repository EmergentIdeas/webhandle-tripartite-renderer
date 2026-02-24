
	import {tripartite} from "tripartite"
	
	let one = tripartite.addTemplate('one', 'hello, __name__!')

	console.log(one({name: 'Dan'}))