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
});