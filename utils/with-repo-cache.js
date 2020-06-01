import LRU from 'lru-cache';

const REPO_CACHE = new LRU({
  maxAge: 1000 * 60 * 5,
}); // cache for 5 minus

export function cache(repo) {
  const full_name = repo.full_name;
  return REPO_CACHE.set(full_name, repo);
} //cache one repo base on its full_name

export function get(full_name) {
  return REPO_CACHE.get(full_name);
}

export function cacheRepos(repos) {
  if (repos && Array.isArray(repos)) {
    repos.forEach((repo) => cache(repo));
  }
}
