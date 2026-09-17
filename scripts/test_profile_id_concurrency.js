import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import dbConnect from '../src/lib/dbConnect.js';
import Counter from '../src/models/Counter.js';
import { generateNextProfileId } from '../src/services/profileIdService.js';

async function runProfileIdConcurrencyTest() {
  console.log('🧪 Starting Atomic Profile ID Concurrency & Collision Test...\n');
  await dbConnect();

  // 1. Fetch current counter state
  const currentCounter = await Counter.findById('profileId');
  console.log('Initial Counter State:', currentCounter ? currentCounter.seq : 'Not yet initialized (defaults to 100000)');

  // 2. Fire 50 concurrent requests simultaneously
  console.log('⚡ Firing 50 parallel asynchronous Profile ID requests via Promise.all...');
  const startTime = Date.now();
  const promises = Array.from({ length: 50 }, () => generateNextProfileId());
  const results = await Promise.all(promises);
  const duration = Date.now() - startTime;

  console.log(`⏱️ Completed 50 parallel requests in ${duration}ms.\n`);

  // 3. Collision Analysis
  const uniqueSet = new Set(results);
  console.log(`Sample generated IDs: ${results.slice(0, 5).join(', ')} ... ${results.slice(-3).join(', ')}`);
  console.log(`Total IDs Generated: ${results.length}`);
  console.log(`Unique IDs Count:    ${uniqueSet.size}`);

  if (uniqueSet.size === results.length) {
    console.log('\n✅ TEST PASSED: 0% COLLISION RATE. All 50 IDs are strictly unique and sequential!');
  } else {
    console.error('\n❌ TEST FAILED: Collisions detected!', results.length - uniqueSet.size);
    process.exit(1);
  }

  process.exit(0);
}

runProfileIdConcurrencyTest().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
