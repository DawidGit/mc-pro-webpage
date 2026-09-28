import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(__dirname, '..');

describe('static SEO assets', () => {
  it('ships robots.txt that allows indexing and points to sitemap', () => {
    const robots = readFileSync(resolve(root, 'public/robots.txt'), 'utf8');
    expect(robots).toMatch(/User-agent:\s*\*/i);
    expect(robots).toMatch(/Allow:\s*\//i);
    expect(robots).toMatch(/Sitemap:\s*https:\/\/mcprogc\.com\/sitemap\.xml/i);
  });

  it('ships sitemap.xml with the homepage URL', () => {
    const sitemap = readFileSync(resolve(root, 'public/sitemap.xml'), 'utf8');
    expect(sitemap).toContain('https://mcprogc.com/');
    expect(sitemap).toContain('<urlset');
  });

  it('has MC Pro title and geo meta in index.html', () => {
    const html = readFileSync(resolve(root, 'index.html'), 'utf8');
    expect(html).toContain('MC Pro, INC.');
    expect(html).toContain('Streamwood');
    expect(html).toContain('geo.region');
    expect(html).toContain('application/ld+json');
    expect(html).toContain('https://mcprogc.com/');
  });
});
