import WordMatcher from '../src/index';

const matcher = new WordMatcher({
  targets: [],
});
const set = [];
const addbutton = document.getElementById('add-set-butt');
const testbutt = document.getElementById('test-butt');

const setContentById = (id: string, content: string): void => {
  const el = document.getElementById(id) as HTMLInputElement | null;
  if (el) {
    el.innerHTML = content;
  }
}
const getInputValueById = (id: string): string => {
  const el = document.getElementById(id) as HTMLInputElement | null;
  return el?.value ?? '';
}

addbutton.addEventListener('click', () => {
  const val = getInputValueById('set');
  if (val) {
    set.push(val);
  }
  matcher.addWord(set);
  setContentById('pattern', JSON.stringify(set));
});

testbutt.addEventListener('click', () => {
  const val = getInputValueById('test-val');
  if (val) {
    const result = matcher.search(val);
    setContentById('result', JSON.stringify(result));
  }
});