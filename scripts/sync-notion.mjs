// Pulls the Notion databases behind Vincent's dashboard and writes data.json.
// Run: NOTION_TOKEN=... node scripts/sync-notion.mjs   (Node 20+, no deps)
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const NOTION_VERSION = '2025-09-03';
const SOURCES = {
  tasks: '72fe7526-a43d-4dfc-906a-f57defb9a1da',
  courses: 'a4e65057-3700-4f29-b66e-66bb761eaad8',
  gym: 'fb8fcdd3-f5c7-419d-9644-d0f001e0f000',
  habits: '80751d7c-34cc-4c22-b177-b86e089be304',
};
const HOME_PAGE = '412837d8e2f5810dab1dc3ef6a5b28e0';
const MAX_BLOCK_DEPTH = 3;
const URL_RE = /https?:\/\/\S+/;

const text = (rich = []) => rich.map(r => r.plain_text).join('').trim();
const prop = (page, name) => page.properties?.[name];
const sel = (page, name) => prop(page, name)?.select?.name ?? null;
const check = (page, name) => prop(page, name)?.checkbox === true;
const date = (page, name) => prop(page, name)?.date ?? null;

export function normalizeTask(page) {
  const raw = text(prop(page, 'Việc')?.title);
  const due = date(page, 'Hạn');
  return {
    id: page.id,
    url: page.url,
    title: raw.replace(URL_RE, '').trim() || raw,
    link: raw.match(URL_RE)?.[0] ?? null,
    area: sel(page, 'Mảng'),
    priority: sel(page, 'Ưu tiên'),
    start: due?.start ?? null,
    end: due?.end ?? null,
    done: check(page, 'Xong'),
    doneAt: date(page, 'Xong lúc')?.start ?? null,
    best: check(page, 'Đáng làm nhất'),
    review: sel(page, 'Duyệt đề xuất'),
    proposal: text(prop(page, 'Đề xuất của agent')?.rich_text) || null,
  };
}

export const normalizeCourse = page => ({
  name: text(prop(page, 'Môn')?.title),
  status: sel(page, 'Trạng thái'),
});

export const normalizeHabit = page => ({
  date: date(page, 'Ngày')?.start ?? null,
  water: check(page, 'Uống đủ nước'),
  workout: check(page, 'Tập luyện'),
  sleep: check(page, 'Ngủ đủ giấc'),
  read: check(page, 'Đọc sách'),
});

export const normalizeGym = page => ({
  name: text(prop(page, 'Buổi')?.title),
  day: sel(page, 'Thứ'),
  type: sel(page, 'Loại'),
  muscles: (prop(page, 'Nhóm cơ')?.multi_select ?? []).map(o => o.name),
});

// Navi (agent COO) writes a quote, a "Làm ngay" callout and a "Cập nhật ..." line on the home page.
export function extractNavi(blocks) {
  const navi = { updated: null, quote: null, focus: null, firstStep: null };
  for (const b of blocks) {
    const body = text(b[b.type]?.rich_text);
    if (b.type === 'quote' && !navi.quote) navi.quote = body;
    if (b.type === 'paragraph' && !navi.updated && body.startsWith('Cập nhật')) navi.updated = body.replace('Cập nhật', '').trim();
    if (b.type === 'callout' && !navi.focus && body.startsWith('Làm ngay')) {
      const lines = [body, ...(b.children ?? []).map(c => text(c[c.type]?.rich_text))].join('\n').split('\n').map(s => s.trim()).filter(Boolean);
      navi.focus = lines[0].replace(/^Làm ngay\s*/, '');
      navi.firstStep = lines.slice(1).join(' ') || null;
    }
  }
  return navi;
}

async function api(path, token, body) {
  const res = await fetch(`https://api.notion.com/v1/${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${token}`, 'Notion-Version': NOTION_VERSION, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Notion ${path} → ${res.status}: ${await res.text()}`);
  return res.json();
}

async function queryAll(id, token) {
  const rows = [];
  let cursor;
  do {
    const page = await api(`data_sources/${id}/query`, token, { page_size: 100, ...(cursor && { start_cursor: cursor }) });
    rows.push(...page.results);
    cursor = page.has_more ? page.next_cursor : undefined;
  } while (cursor);
  return rows;
}

// Flattened depth-first list; callouts keep their own children for extractNavi.
async function walkBlocks(id, token, depth = 0) {
  const out = [];
  let cursor;
  do {
    const page = await api(`blocks/${id}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ''}`, token);
    for (const b of page.results) {
      const kids = b.has_children && depth < MAX_BLOCK_DEPTH && !b.type.startsWith('child_') ? await walkBlocks(b.id, token, depth + 1) : [];
      out.push(b.type === 'callout' ? { ...b, children: kids } : b, ...(b.type === 'callout' ? [] : kids));
    }
    cursor = page.has_more ? page.next_cursor : undefined;
  } while (cursor);
  return out;
}

async function main() {
  const token = process.env.NOTION_TOKEN;
  if (!token) throw new Error('NOTION_TOKEN is not set');
  const [tasks, courses, gym, habits, blocks] = await Promise.all([
    queryAll(SOURCES.tasks, token),
    queryAll(SOURCES.courses, token),
    queryAll(SOURCES.gym, token),
    queryAll(SOURCES.habits, token),
    walkBlocks(HOME_PAGE, token),
  ]);
  const data = {
    generatedAt: new Date().toISOString(),
    navi: extractNavi(blocks),
    tasks: tasks.map(normalizeTask),
    courses: courses.map(normalizeCourse).filter(c => c.name),
    gym: gym.map(normalizeGym).filter(g => g.name),
    habits: habits.map(normalizeHabit).filter(h => h.date),
  };
  writeFileSync(new URL('../data.json', import.meta.url), JSON.stringify(data, null, 2) + '\n');
  console.log(`data.json: ${data.tasks.length} tasks, ${data.courses.length} courses, ${data.habits.length} habit days`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(err => { console.error(err.message); process.exit(1); });
}
