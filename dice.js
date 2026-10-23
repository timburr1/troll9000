const MAX_DICE = 100;
const MAX_SIDES = 1000;
const MAX_TERMS = 10;

// matches one term: "4d6kh3", "d20", "2d20kl1", or a flat number like "5"
const TERM = /^(?:(\d*)d(\d+)(?:(kh|kl)(\d+))?|(\d+))$/i;

function roll(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

// parse "4d6kh3 + 2" into signed terms; throws Error with a user-facing message
function parse(expr) {
  const cleaned = expr.replace(/\s+/g, '');
  if (!cleaned) throw new Error('give me something to roll, e.g. `2d6+3`.');

  const pieces = cleaned.split(/([+-])/);
  // a leading sign leaves an empty first piece
  if (pieces[0] === '') pieces.shift();
  else pieces.unshift('+');

  const terms = [];
  for (let i = 0; i < pieces.length; i += 2) {
    const sign = pieces[i] === '-' ? -1 : 1;
    const body = pieces[i + 1];
    const m = body && TERM.exec(body);
    if (!m) throw new Error('can\'t read `' + (body || cleaned) + '`. Try `2d6+3`, `d20`, or `4d6kh3`.');

    if (m[5] !== undefined) {
      terms.push({ sign, flat: parseInt(m[5], 10) });
      continue;
    }

    const count = m[1] === '' ? 1 : parseInt(m[1], 10);
    const sides = parseInt(m[2], 10);
    if (count < 1 || count > MAX_DICE) throw new Error('roll between 1 and ' + MAX_DICE + ' dice at a time.');
    if (sides < 2 || sides > MAX_SIDES) throw new Error('dice need between 2 and ' + MAX_SIDES + ' sides.');

    let keep = null;
    if (m[3]) {
      const n = parseInt(m[4], 10);
      if (n < 1 || n > count) throw new Error('can\'t keep ' + n + ' of ' + count + ' dice.');
      keep = { mode: m[3].toLowerCase(), n };
    }
    terms.push({ sign, count, sides, keep, label: body.toLowerCase() });
  }

  if (terms.length > MAX_TERMS) throw new Error('at most ' + MAX_TERMS + ' terms per roll.');
  return terms;
}

// roll one dice term; marks which results are kept
function rollTerm(term) {
  const results = [];
  for (let i = 0; i < term.count; i++) results.push({ value: roll(term.sides), kept: true });

  if (term.keep) {
    const order = results.slice().sort((a, b) => term.keep.mode === 'kh' ? b.value - a.value : a.value - b.value);
    order.slice(term.keep.n).forEach(r => { r.kept = false; });
  }
  return results;
}

// returns { total, text } where text is a markdown breakdown
function evaluate(expr) {
  const terms = parse(expr);
  let total = 0;
  const parts = [];

  terms.forEach((term, i) => {
    const sign = term.sign < 0 ? '-' : '+';
    let subtotal;
    let shown;

    if (term.flat !== undefined) {
      subtotal = term.flat;
      shown = String(term.flat);
    } else {
      const results = rollTerm(term);
      subtotal = results.filter(r => r.kept).reduce((sum, r) => sum + r.value, 0);
      shown = '[' + results.map(r => r.kept ? String(r.value) : '~~' + r.value + '~~').join(', ') + ']';
    }

    total += term.sign * subtotal;
    parts.push(i === 0 && sign === '+' ? shown : sign + ' ' + shown);
  });

  return { total, text: parts.join(' ') };
}

module.exports = { parse, evaluate };
