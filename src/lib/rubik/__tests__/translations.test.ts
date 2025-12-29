import { describe, it, expect } from 'vitest';
import { translations, t } from '../translations';
import type { Language } from '../types';

describe('Translations', () => {
  it('pt should include all keys from en (or rely on safe fallback)', () => {
    const keys = Object.keys(translations.en) as (keyof typeof translations.en)[];

    keys.forEach((key) => {
      // If a key is missing in pt, t() should fallback to en (and not crash)
      const value = t(key, 'pt' as Language);
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('should translate mobile accordion titles in Portuguese', () => {
    expect(t('historyShort', 'pt' as Language)).toBe('Histórico');
    expect(t('controls', 'pt' as Language)).toBe('Controles');
    expect(t('tutorial', 'pt' as Language)).toBe('Tutorial');
    expect(t('practice', 'pt' as Language)).toBe('Prática');
  });
});
