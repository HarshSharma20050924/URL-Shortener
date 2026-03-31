import axios from 'axios';

async function runLoadTest() {
    const API_BASE = 'http://localhost:5000';
    const TEST_URL = 'https://google.com';
    const CONCURRENT_REQUESTS = 50;

    console.log(`🚀 Starting Load Test: ${CONCURRENT_REQUESTS} concurrent requests...`);

    const start = Date.now();

    try {
        // 1. Create a URL
        const createRes = await axios.post(`${API_BASE}/api/shorten`, { longUrl: TEST_URL });
        const shortCode = createRes.data.shortCode;
        console.log(`✅ URL Shortened: ${shortCode}`);

        // 2. Hammer the redirect endpoint
        const promises = Array(CONCURRENT_REQUESTS).fill(null).map(() => 
            axios.get(`${API_BASE}/${shortCode}`, { maxRedirects: 0, validateStatus: () => true })
        );

        await Promise.all(promises);

        const duration = Date.now() - start;
        console.log(`🏁 Test Completed in ${duration}ms`);
        console.log(`⚡ Average Latency: ${duration / CONCURRENT_REQUESTS}ms per request`);

    } catch (err) {
        console.error('❌ Test Failed:', err.message);
    }
}

runLoadTest();
