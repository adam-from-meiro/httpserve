const TEST_COUNT = 10;
const TEST_PAYLOAD = {
  events: Array.from({ length: 10 }, (_, i) => ({ hello: `world${i + 1}` }))
};

async function measureRequest(): Promise<number> {
  const startTime = performance.now();
  
  const response = await fetch("http://localhost:8000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(TEST_PAYLOAD),
  });
  
  await response.json(); // Wait for body to be read
  const endTime = performance.now();
  return endTime - startTime;
}

async function runTests() {
  console.log("Starting performance tests...\n");
  
  const times: number[] = [];
  
  for (let i = 0; i < TEST_COUNT; i++) {
    try {
      const time = await measureRequest();
      times.push(time);
      console.log(`Request ${i + 1}: ${time.toFixed(2)}ms`);
    } catch (error) {
      console.error(`Error in request ${i + 1}:`, error);
    }
    
    // Small delay between requests to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Calculate statistics
  const average = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);
  const sorted = [...times].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  
  console.log("\nResults:");
  console.log(`Average time: ${average.toFixed(2)}ms`);
  console.log(`Median time: ${median.toFixed(2)}ms`);
  console.log(`Min time: ${min.toFixed(2)}ms`);
  console.log(`Max time: ${max.toFixed(2)}ms`);
}

// Run the tests
runTests();