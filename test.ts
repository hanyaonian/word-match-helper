import textHelper from './index'

const testCase = [
	{
		reg: null,
		key: ['her', 'he', 's h e', 'hers'],
		text: "us h ers h e hE r",
		expect: [
			{ pos: 5, word: 's h e' },
			{ pos: 11, word: 's h e' },
			{ pos: 14, word: 'he' }
		]
	},
	{
		key: ['her', 'he', 'she', 'hers'],
		text: "ushers",
		expect: [
			{ pos: 3, word: 'she' },
			{ pos: 5, word: 'hers' },
			{ pos: 3, word: 'he' },
			{ pos: 4, word: 'her'},
		]
	},
	// default regexp: skip all space
	{
		reg: /\s+|\*/g,
		key: ['shit'],
		text: "s h ** i t",
		expect: [
		    { pos: 9, word: 'shit' }
		]
    	}
]

for (let i = 0; i < testCase.length; i++) {
	let th = new textHelper(testCase[i].key, {
		ignorePatt: testCase[i].reg,
		baseStrict: false
	});
	const response = th.search(testCase[i].text);
	console.log('word:', testCase[i].key, 'text:', testCase[i].text);
	console.log('match:', response.sort());
	console.log('expect:', testCase[i].expect.sort());
	console.log('filtered:', th.filter(testCase[i].text))
}
