// node scripts/sync-notion.check.mjs — self-check for the Notion → data.json mapping.
import assert from 'node:assert/strict';
import { normalizeTask, extractNavi } from './sync-notion.mjs';

const rt = s => [{ plain_text: s }];
const task = normalizeTask({
  id: 'x', url: 'https://notion.so/x',
  properties: {
    'Việc': { title: rt('Phân tích bóc tách https://www.tiktok.com/@a/video/1') },
    'Mảng': { select: { name: 'Edit' } },
    'Ưu tiên': { select: { name: 'Thấp' } },
    'Hạn': { date: { start: '2026-11-10', end: null } },
    'Xong': { checkbox: false },
    'Đáng làm nhất': { checkbox: true },
    'Duyệt đề xuất': { select: { name: 'Chờ' } },
    'Đề xuất của agent': { rich_text: rt('Dời hạn sang 15/11') },
  },
});
assert.equal(task.title, 'Phân tích bóc tách');
assert.equal(task.link, 'https://www.tiktok.com/@a/video/1');
assert.equal(task.area, 'Edit');
assert.equal(task.start, '2026-11-10');
assert.equal(task.done, false);
assert.equal(task.best, true);
assert.equal(task.review, 'Chờ');
assert.equal(task.proposal, 'Dời hạn sang 15/11');
assert.equal(normalizeTask({ properties: {} }).priority, null);

const navi = extractNavi([
  { type: 'paragraph', paragraph: { rich_text: rt('Cập nhật 14/11 · 17:52') } },
  { type: 'quote', quote: { rich_text: rt('Xong 1/3') } },
  { type: 'callout', callout: { rich_text: rt('Làm ngay  Kịch bản · trễ 4 ngày') },
    children: [{ type: 'paragraph', paragraph: { rich_text: rt('15 phút đầu → Mở video') } }] },
]);
assert.deepEqual(navi, { updated: '14/11 · 17:52', quote: 'Xong 1/3', focus: 'Kịch bản · trễ 4 ngày', firstStep: '15 phút đầu → Mở video' });

console.log('sync-notion: all checks passed');
