import textHelper from './index'

const testCase = [
	{
		key: ['her', 'he', 'she', 'hers'],
		text: "ushers",
		expect: [
			{ pos: [1, 3], word: 'she' },
			{ pos: [2, 5], word: 'hers' },
			{ pos: [2, 3], word: 'he' },
			{ pos: [2, 4], word: 'her'},
		]
	}
]

for (let i = 0; i < testCase.length; i++) {
	let th = new textHelper(testCase[i].key);
	const response = th.searchWord(testCase[i].text);
	console.log('out', response.sort());
	console.log('expected', testCase[i].expect.sort());
}