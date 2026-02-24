const path = require('path');

let buildTargets = []

let browserTarget =
{
	entry: './lib/component.mjs',
	mode: 'production',
	"devtool": 'source-map',
	experiments: {
		outputModule: true,
	},
	output: {
		filename: 'tripartite.js',
		path: path.resolve(__dirname, 'resources'),
		library: {
			type: 'module',
		}
	},
	module: {
	},
	resolve: {
		fallback: {
			// stream: require.resolve('stream-browserify'),
		}
	},
	plugins: [
	],
	stats: {
		colors: true,
		reasons: true
	},

}

buildTargets.push(browserTarget)

module.exports = buildTargets
