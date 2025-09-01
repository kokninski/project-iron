import { getEntry } from 'astro:content';

export async function getHome() {
  const entry = await getEntry('home', 'index');
  return entry.data;
}
