// Rules-based Home Finder engine. Pure function, no DOM, no network.
// Shared by the prototype UI (Stage 5) and tools/seed/validate-seed.mjs.
//
// recommend(models, finder, answers, lang) ->
//   { matches: [...], close: [...], notes: [...] }
// Each result: { model, score, reasons: [text], failed: [text] }

const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);

export function test(model, { field, op, value }) {
  const v = get(model, field);
  switch (op) {
    case 'eq': return v === value;
    case 'in': return Array.isArray(value) && value.includes(v);
    case 'includes': return Array.isArray(v) && v.includes(value);
    // Missing numbers (e.g. bedrooms = null for an open-plan or loft home) count as 0.
    case 'gte': return (v ?? 0) >= value;
    case 'lte': return v != null && v <= value;
    case 'missing': return v == null;
    default: throw new Error(`Unknown op: ${op}`);
  }
}

export function recommend(models, finder, answers, lang = 'th') {
  const t = (o) => (o && (o[lang] ?? o.en ?? o.th)) || '';
  const pool = models.filter((m) => m.show_in_finder !== false);
  const notes = new Set();
  const results = pool.map((model) => ({ model, score: 0, reasons: [], failed: [] }));

  for (const q of finder.questions) {
    const opt = q.options.find((o) => o.id === answers[q.id]);
    if (q.always_note) notes.add(t(q.always_note));
    if (!opt) continue;
    for (const r of results) {
      for (const e of opt.effects) {
        const ok = test(r.model, e);
        if (e.type === 'require' && !ok) r.failed.push(t(e.reason));
        if (e.type === 'require' && ok) r.reasons.push(t(e.reason));
        if (e.type === 'boost' && ok) { r.score += e.weight ?? 1; r.reasons.push(t(e.reason)); }
        if (e.type === 'note' && ok) notes.add(t(e.reason));
      }
    }
  }

  const sort = (a, b) => b.score - a.score || a.model.price.display_thb - b.model.price.display_thb;
  const max = finder.results?.max_results ?? 3;
  const matches = results.filter((r) => r.failed.length === 0).sort(sort).slice(0, max);
  const close = matches.length
    ? []
    : results.filter((r) => r.failed.length === 1).sort(sort).slice(0, max);
  return { matches, close, notes: [...notes] };
}
