import test from 'node:test';
import assert from 'node:assert/strict';
import { submitContact } from '../lib/contact.ts';

const valid = () => ({ name: 'Test Person', email: 'test@example.com', projectType: 'SaaS & API development', budget: '', message: 'I would like to discuss a Laravel platform.', website: '', startedAt: Date.now() - 5000 });
const noFetch = async () => { assert.fail('must not contact provider'); };

test('invalid input never reaches the provider', async () => {
  for (const override of [{ email: 'invalid' }, { name: 'A' }, { message: 'short' }, { message: 'x'.repeat(5001) }, { projectType: 'unknown' }]) {
    assert.equal((await submitContact({ ...valid(), ...override }, noFetch)).success, false);
  }
});
test('rejects honeypot and implausible submission timing', async () => {
  for (const override of [{ website: 'spam' }, { startedAt: Date.now() }, { startedAt: Date.now() + 60000 }]) {
    assert.equal((await submitContact({ ...valid(), ...override }, noFetch)).success, false);
  }
});
test('sends validated fields to Web3Forms and uses the configured form key', async () => {
  let calls = 0;
  const result = await submitContact({ ...valid(), access_key: 'attacker-key', to: 'attacker@example.com' }, async (url, options) => {
    calls++;
    assert.equal(url, 'https://api.web3forms.com/submit');
    assert.equal(options.method, 'POST');
    const data = JSON.parse(options.body);
    assert.equal(data.access_key, 'e994ded9-59ab-4e7d-8fca-41c281802ff7');
    assert.equal(data.email, 'test@example.com');
    assert.equal(data.project_type, 'SaaS & API development');
    assert.equal(data.budget, 'Not specified');
    assert.equal(data.botcheck, false);
    assert.ok(data.message.includes('Laravel'));
    assert.equal(data.to, undefined);
    assert.equal(data.startedAt, undefined);
    return Response.json({ success: true });
  });
  assert.equal(result.success, true);
  assert.equal(calls, 1);
});
test('HTTP errors and unsuccessful or malformed receipts never produce success', async () => {
  for (const [body, status] of [[{ success: true }, 500], [{ success: false }, 200], [{}, 200], [null, 200], [{ success: 'true' }, 200]]) {
    assert.equal((await submitContact(valid(), async () => Response.json(body, { status }))).success, false);
  }
});
test('rate limits provide an actionable message', async () => {
  const result = await submitContact(valid(), async () => new Response('', { status: 429 }));
  assert.equal(result.success, false);
  assert.match(result.message, /try later/i);
});
test('invalid JSON is treated as unconfirmed delivery', async () => {
  const result = await submitContact(valid(), async () => new Response('<html>error</html>'));
  assert.equal(result.success, false);
  assert.match(result.message, /could not be confirmed/);
});
test('network failures and timeouts do not claim success', async () => {
  const result = await submitContact(valid(), async () => { throw new Error('timeout'); });
  assert.equal(result.success, false);
  assert.match(result.message, /email/);
});
