import { describe, expect, test } from '@jest/globals';
import WordMatcher from '../src/index';

describe('main module', () => {
  test('classic "ushers" case', () => {
    const matcher = new WordMatcher({
      targets: ['her', 'he', 'she', 'hers'],
    })
    const result = matcher.search('ushers').map(v => v.word);
    expect(result.length).toBe(4);
    expect(result).toContain('her');
    expect(result).toContain('he');
    expect(result).toContain('hers');
    expect(result).toContain('she');
  });

  test('simple duplicate string', () => {
    const matcher = new WordMatcher({
      targets: ['aaab'],
    });
    const result = matcher.search('aabaaabaabaabaabaaaaabaab').map(v => v.word);
    expect(result.length).toBe(2);
    expect(result).toContain('aaab');
  })
});

describe('extend word set', () => {
  test('usher with extention', () => {
    const matcher = new WordMatcher({
      targets: ['her', 'he'],
    });
    const result = matcher.search('ushers').map(v => v.word);
    expect(result.length).toBe(2);
    expect(result).toContain('her');
    expect(result).toContain('he');
    // extention
    matcher.addWord(['hers', 'she']);
    const result2 = matcher.search('ushers').map(v => v.word);
    expect(result2.length).toBe(4);
    expect(result2).toContain('her');
    expect(result2).toContain('he');
    expect(result2).toContain('hers');
    expect(result2).toContain('she');
  })
});
