/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./src/views/**/*.{html,js,ejs}",
		"./node_modules/flowbite/**/*.js",
	],
	theme: {
		extend: {
			colors: {
				primary: "#007236",
				secondary: "#63c793",
			},
		},
	},

	plugins: [require("flowbite/plugin")],
};
