import textHelper from './index'

const testCase = [
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
            { pos: 9, word: 'shit' },
        ]
    }
]

for (let i = 0; i < testCase.length; i++) {
	let th = new textHelper(testCase[i].key, testCase[i].reg);
	const response = th.search(testCase[i].text);
	console.log('out', response.sort());
	console.log('expected', testCase[i].expect.sort());
}
