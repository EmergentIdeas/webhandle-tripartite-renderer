export default function determineTemplateName(filePath, viewPaths) {
	for(let viewPath of viewPaths) {
		if(filePath.startsWith(viewPath)) {
			let name = filePath.substring(viewPath.length)
			if(name.startsWith('/')) {
				name = name.substring(1)
			}
			if(name.endsWith('.tri')) {
				name = name.substring(0, name.length - 4)
			}
			return name
		}
	}
	return filePath
}