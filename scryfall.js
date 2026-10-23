const API = 'https://api.scryfall.com';

// Scryfall requires a User-Agent and Accept header on every request
const HEADERS = {
  'User-Agent': 'Troll9000/1.0 (Discord bot)',
  'Accept': 'application/json'
};

async function get(path) {
  const res = await fetch(API + path, { headers: HEADERS });
  const body = await res.json();
  if (!res.ok) {
    const err = new Error(body.details || 'Scryfall error ' + res.status);
    err.status = res.status;
    throw err;
  }
  return body;
}

// fuzzy name match; throws with err.status 404 when nothing (or too many things) match
function findCard(name) {
  return get('/cards/named?fuzzy=' + encodeURIComponent(name));
}

// up to 20 card names for the autocomplete dropdown
async function autocomplete(query) {
  const body = await get('/cards/autocomplete?q=' + encodeURIComponent(query));
  return body.data;
}

module.exports = { findCard, autocomplete };
