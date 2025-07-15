module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es2021: true,
	},
	parser: "vue-eslint-parser",
	parserOptions: {
		parser: "@babel/eslint-parser",
		requireConfigFile: false,
		ecmaVersion: 2021,
		sourceType: "module",
	},
	extends: [
		"eslint:recommended",
		"plugin:vue/vue3-recommended",
		"plugin:perfectionist/recommended-natural",
		"prettier", // disables conflicting rules
	],
	plugins: ["vue", "perfectionist"],
	rules: {
		// Destructuring multiline formatting
		"perfectionist/sort-destructuring-properties": [
			"warn",
			{
				type: "natural",
				order: "asc",
				groups: ["multiline"],
				multiline: "always", // force break into lines
				minProperties: 3, // break into lines if >= 3 props
			},
		],
	},
};
