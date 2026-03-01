import { test } from '@playwright/test';

test('partner verification run', async ({ page }) => {
  const runtime = { pageErrors: [], consoleErrors: [] };
  page.on('pageerror', (err) => runtime.pageErrors.push(String(err && err.message ? err.message : err)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') runtime.consoleErrors.push(msg.text());
  });

  const result = {
    navigation: { partnerSpaceReached: false, path: null },
    smoke: {
      meetingPrep: { rendered: false, vendorIntelVisible: false },
      accountIntelligence: { rendered: false, switchedValues: [] },
      dealPlanning: { rendered: false },
      vendorIntelligence: { rendered: false, sectionsOrEmptyVisible: false }
    },
    matrix: {},
    runtime
  };

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  await page.goto('http://localhost:8080/partner', { waitUntil: 'domcontentloaded' });
  await wait(1200);

  const meetingTab = page.getByRole('button', { name: 'Meeting Prep' }).first();
  let hasMeetingTab = await meetingTab.count();

  if (!hasMeetingTab) {
    await page.goto('http://localhost:8080/', { waitUntil: 'domcontentloaded' });
    await wait(500);
    const partnerBtn = page.getByRole('button', { name: /Partner Space/i }).first();
    if (await partnerBtn.count()) {
      await partnerBtn.click();
      await wait(1200);
    }
    hasMeetingTab = await meetingTab.count();
  }

  result.navigation.partnerSpaceReached = !!hasMeetingTab;
  result.navigation.path = page.url();

  if (!hasMeetingTab) {
    console.log('RESULT_JSON::' + JSON.stringify({ ...result, fatal: 'Could not reach Partner Space tabs.' }));
    return;
  }

  // A) Meeting Prep
  await meetingTab.click();
  await wait(300);
  result.smoke.meetingPrep.rendered = await page.getByText('Meeting Prep', { exact: false }).first().isVisible().catch(() => false);
  const vendorIntelInMeeting = page.getByText('Vendor Intel (Microsoft)', { exact: false }).first();
  if (await vendorIntelInMeeting.count()) {
    await vendorIntelInMeeting.scrollIntoViewIfNeeded();
    await wait(200);
    result.smoke.meetingPrep.vendorIntelVisible = await vendorIntelInMeeting.isVisible().catch(() => false);
  }

  // B) Account Intelligence + focus switching
  const accountTab = page.getByRole('button', { name: 'Account Intelligence' }).first();
  await accountTab.click();
  await wait(700);
  result.smoke.accountIntelligence.rendered = await page.getByRole('button', { name: /Add evidence/i }).first().isVisible().catch(() => false);

  const aiFocusSelect = page.locator('select').first();
  const aiOptions = await aiFocusSelect.locator('option').evaluateAll((opts) =>
    opts.map((o) => ({ value: o.value, label: (o.textContent || '').trim() }))
  );
  const wanted = ['schindler', 'fifa'];
  for (const w of wanted) {
    const match = aiOptions.find((o) => (o.value || '').toLowerCase() === w || (o.label || '').toLowerCase() === w);
    if (match) {
      await aiFocusSelect.selectOption(match.value);
      await wait(300);
      result.smoke.accountIntelligence.switchedValues.push(match.value || match.label);
    }
  }
  if (result.smoke.accountIntelligence.switchedValues.length < 2) {
    for (const opt of aiOptions.slice(0, 2)) {
      if (!result.smoke.accountIntelligence.switchedValues.includes(opt.value || opt.label)) {
        await aiFocusSelect.selectOption(opt.value);
        await wait(300);
        result.smoke.accountIntelligence.switchedValues.push(opt.value || opt.label);
      }
    }
  }

  // C) Deal Planning
  const dealTab = page.getByRole('button', { name: 'Deal Planning' }).first();
  await dealTab.click();
  await wait(700);
  result.smoke.dealPlanning.rendered = await page.getByText('Deal Planning', { exact: false }).first().isVisible().catch(() => false);

  // D) Vendor Intelligence base render
  const vendorTab = page.getByRole('button', { name: 'Vendor Intelligence' }).first();
  await vendorTab.click();
  await wait(700);

  const vendorLabel = page.getByText('Vendor', { exact: true }).first();
  const updatesHeading = page.getByRole('heading', { name: 'Updates' }).first();
  const emptyMsg = page.getByText('No vendor intel for this filter.', { exact: false }).first();
  result.smoke.vendorIntelligence.rendered = await vendorLabel.isVisible().catch(() => false);
  result.smoke.vendorIntelligence.sectionsOrEmptyVisible =
    (await updatesHeading.isVisible().catch(() => false)) || (await emptyMsg.isVisible().catch(() => false));

  const vendorSelect = page.locator('label:has-text(\"Vendor\") select').first();
  const focusSelect = page.locator('label:has-text(\"Focus (optional)\") select').first();
  const weekInput = page.locator('label:has-text(\"Week (optional)\") input').first();

  const focusOptions = await focusSelect.locator('option').evaluateAll((opts) =>
    opts.map((o) => ({ value: o.value, label: (o.textContent || '').trim() }))
  );
  const nonEmptyFocus = focusOptions.filter((o) => o.value);
  const preferredFocus = nonEmptyFocus.find((o) => o.value.toLowerCase() === 'schindler') || nonEmptyFocus[0] || { value: '' };
  const defaultWeek = (await weekInput.inputValue().catch(() => '')) || '2026-02-10';

  async function collectState(vendorId, focusSet, weekSet) {
    await vendorSelect.selectOption(vendorId);
    await wait(150);

    if (focusSet && preferredFocus.value) {
      await focusSelect.selectOption(preferredFocus.value);
    } else {
      await focusSelect.selectOption('');
    }
    await wait(150);

    if (weekSet) {
      await weekInput.fill(defaultWeek);
    } else {
      await weekInput.fill('');
    }
    await weekInput.press('Tab').catch(() => {});
    await wait(250);

    const titles = await page.locator('li p.text-sm.font-medium').allTextContents();
    const cleaned = [...new Set(titles.map((t) => (t || '').trim()).filter(Boolean))];
    const hasEmpty = await page.getByText('No vendor intel for this filter.', { exact: false }).first().isVisible().catch(() => false);
    const noItemsCount = await page.getByText('No items.', { exact: false }).count();

    return {
      focus: focusSet ? (preferredFocus.value || '(none available)') : '(cleared)',
      week: weekSet ? defaultWeek : '(cleared)',
      itemCount: cleaned.length,
      sampleItems: cleaned.slice(0, 8),
      hasGlobalEmptyMessage: hasEmpty,
      noItemsSectionCount: noItemsCount
    };
  }

  const combos = [
    { key: 'i_focus+week', focusSet: true, weekSet: true },
    { key: 'ii_focus+noWeek', focusSet: true, weekSet: false },
    { key: 'iii_noFocus+week', focusSet: false, weekSet: true },
    { key: 'iv_noFocus+noWeek', focusSet: false, weekSet: false }
  ];

  for (const vendorId of ['microsoft', 'credo_ai']) {
    result.matrix[vendorId] = {};
    for (const combo of combos) {
      result.matrix[vendorId][combo.key] = await collectState(vendorId, combo.focusSet, combo.weekSet);
    }
  }

  const msAll = new Set(result.matrix.microsoft['iv_noFocus+noWeek'].sampleItems);
  const crAll = new Set(result.matrix.credo_ai['iv_noFocus+noWeek'].sampleItems);
  result.matrix.overlapSampleInBroadState = [...msAll].filter((x) => crAll.has(x));

  console.log('RESULT_JSON::' + JSON.stringify(result));
});
