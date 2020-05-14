//@ts-nocheck
const port = process.env.PORT || 4444;

describe('Basic', () => {
  beforeAll(async () => {
    await page.goto(`http://localhost:${port}/tests/basic/index.html`);
  });

  it('should display things', async () => {
    await expect(page).toMatchElement('.gstc__list-column-header-resizer-container--label', {
      text: 'Label',
    });
    await expect(page).toMatchElement('.gstc__list-column-row-content--1-label', { text: 'row id: 1' });
    await expect(page).toMatchElement('.gstc__chart-timeline-grid-row--13');
    await expect(page).toMatchElement('.gstc__chart-calendar-date--level-1');
    await expect(page).toMatchElement('.gstc__scroll-bar--vertical');
    await expect(page).toMatchElement('.gstc__scroll-bar--horizontal');
    await expect(page).toMatchElement('.gstc__chart-timeline-grid-row-cell.current');
  });

  it('should expand row', async () => {
    await expect(page).not.toMatchElement('.gstc__list-column-row-content--2-label');
    await page.click('.gstc__list-column-row-expander--1');
    await expect(page).toMatchElement('.gstc__list-column-row-content--2-label', { text: 'row id: 2' });
    await page.click('.gstc__list-column-row-expander--1');
    await expect(page).not.toMatchElement('.gstc__list-column-row-content--2-label');
  });

  it('should hide left side list', async () => {
    await page.click('.gstc__list-toggle');
    await expect(page).not.toMatchElement('.gstc__list');
    await page.click('.gstc__list-toggle');
    await expect(page).toMatchElement('.gstc__list');
  });

  it('should change chart height (inner)', async () => {
    await expect(page).toMatchElement('.gstc__list-column-row-content--1-label');
    await expect(page).toMatchElement('.gstc__list-column-row-content--5-label');
    await page.evaluate((_) => {
      state.update('config.innerHeight', 100);
    });
    await expect(page).toMatchElement('.gstc__list-column-row-content--1-label');
    await expect(page).not.toMatchElement('.gstc__list-column-row-content--5-label');
    await page.evaluate((_) => {
      state.update('config.innerHeight', 400);
    });
    await expect(page).toMatchElement('.gstc__list-column-row-content--1-label');
    await expect(page).toMatchElement('.gstc__list-column-row-content--5-label');
  });
});
