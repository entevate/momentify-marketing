# Testing Quick Start Guide

## TL;DR - Get Started in 30 Seconds

```bash
cd Website
npm install
npm test
```

## Common Commands

### Run All Tests
```bash
npm test
```

### Watch Mode (Auto-rerun on file changes)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### Run Specific Test File
```bash
npm test -- generate-asset-html.test.ts
```

### Run Tests Matching a Pattern
```bash
npm test -- --testNamePattern="HTML Validation"
```

## What Gets Tested

**API Endpoint:** `POST /api/gtm/generate-asset-html`

**Test Coverage:**
- ✅ Parameter validation (brief, assetType, solution required)
- ✅ Path traversal protection (security)
- ✅ Asset type validation (infographic, microsite, carousel, pitch-deck, one-pager)
- ✅ API key handling (GTM_ANTHROPIC_KEY, ANTHROPIC_API_KEY)
- ✅ Claude API integration (error handling, response parsing)
- ✅ HTML validation (DOCTYPE, closing tags)
- ✅ File operations (directory creation, file writing)
- ✅ Success cases (correct URLs, filenames)
- ✅ Edge cases (long content, unicode)

**Test Count:** 25+ tests in one test suite

## File Locations

- **Tests:** `src/app/api/gtm/__tests__/generate-asset-html.test.ts`
- **Jest Config:** `jest.config.js` + `jest.setup.js`
- **API Code:** `src/app/api/gtm/generate-asset-html/route.ts`
- **Test Docs:** `src/app/api/gtm/__tests__/README.md`
- **Manual Tests:** `src/app/api/gtm/__tests__/E2E-MANUAL-TESTING-CHECKLIST.md`

## Setup

### 1. Install Dependencies
```bash
cd Website
npm install
```

This adds:
- jest
- ts-jest
- @types/jest
- @testing-library/jest-dom
- jest-environment-node
- etc.

### 2. Verify Installation
```bash
npm test -- --version
```

Should output Jest version info.

## Running Tests

### First Time
```bash
npm test
```

Expected output:
```
PASS  src/app/api/gtm/__tests__/generate-asset-html.test.ts
  POST /api/gtm/generate-asset-html
    ✓ Parameter Validation (3 tests)
    ✓ Path Traversal Protection (3 tests)
    ✓ Asset Type Validation (2 tests)
    ✓ API Key Handling (2 tests)
    ✓ Claude API Integration (4 tests)
    ✓ HTML Validation (3 tests)
    ✓ File Operations (3 tests)
    ✓ Success Cases (2 tests)
    ✓ Edge Cases (2 tests)

Tests:       25 passed, 25 total
```

### Watch Mode (for development)
```bash
npm run test:watch
```

Press `a` to run all, `p` to filter by filename, `q` to quit.

### Coverage Report
```bash
npm run test:coverage
```

Opens coverage report in terminal. Check `coverage/lcov-report/index.html` in browser for details.

## Understanding Test Results

### ✅ Test Passed
- Green checkmark means test passed
- No action needed

### ❌ Test Failed
```
● POST /api/gtm/generate-asset-html › should return 400 when brief is missing
  expect(response.status).toBe(400)
  Expected: 400
  Received: 200
```

Check:
1. Which test failed (name in error message)
2. What was expected vs received
3. Check the test file for that specific test
4. Check the API implementation for that case

## Test Structure Overview

```typescript
describe("POST /api/gtm/generate-asset-html", () => {
  describe("Parameter Validation", () => {
    it("should return 400 when brief is missing", async () => {
      // Test implementation
    })
  })
  
  describe("HTML Validation", () => {
    it("should return 400 when HTML is missing DOCTYPE", async () => {
      // Test implementation
    })
  })
})
```

Each `describe` block is a test suite.
Each `it` block is a single test case.

## Environment Setup

Tests use these environment variables (can be mocked):
- `ANTHROPIC_API_KEY` - API key for Claude
- `GTM_ANTHROPIC_KEY` - Alternative API key (takes precedence)
- `CLAUDE_MODEL` - Model name (defaults to "claude-sonnet-5")

Tests mock the API key, so no real key needed for unit tests.

For manual E2E testing:
```bash
# In .env.local
ANTHROPIC_API_KEY=sk-proj-your-real-key-here
```

## Troubleshooting

### "Cannot find module" error
```bash
npm install
```

### Tests timeout
The default timeout is 10 seconds. Most tests should complete in <1 second.

If a specific test times out:
1. Check if it's trying to make a real API call (it shouldn't)
2. Verify mocks are set up correctly
3. Check for infinite loops in tested code

### Mock not working
Make sure the mock is set up BEFORE the test runs:

```typescript
beforeEach(() => {
  jest.clearAllMocks()
  process.env.ANTHROPIC_API_KEY = "test-key"
})
```

### "fs.existsSync is not a function"
The fs module is mocked. You need to set up the mock:

```typescript
jest.mock("fs")

// Then in test:
;(fs.existsSync as jest.Mock).mockReturnValue(true)
```

## Adding a New Test

```typescript
it("should [expected behavior] when [condition]", async () => {
  // Setup
  process.env.ANTHROPIC_API_KEY = "test-key"
  ;(fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ content: [{ type: "text", text: "<!DOCTYPE html><html></html>" }] })
  })
  ;(fs.existsSync as jest.Mock).mockReturnValue(true)
  ;(fs.writeFileSync as jest.Mock).mockImplementation(() => {})

  // Execute
  const request = new NextRequest("http://localhost:3000/api/gtm/generate-asset-html", {
    method: "POST",
    body: JSON.stringify({
      brief: "Test brief",
      assetType: "infographic",
      solution: "trade-shows",
    }),
  })
  const response = await POST(request)

  // Assert
  expect(response.status).toBe(200)
  expect(fs.writeFileSync).toHaveBeenCalled()
})
```

## Manual Testing

For E2E testing through the UI:

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Open browser
# Navigate to GTM Content Builder
# Follow: src/app/api/gtm/__tests__/E2E-MANUAL-TESTING-CHECKLIST.md
```

## CI/CD Integration

To run tests in GitHub Actions:

```yaml
- name: Run tests
  run: |
    cd Website
    npm install
    npm test

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./Website/coverage/lcov.info
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `jest.config.js` | Jest configuration (Next.js setup) |
| `jest.setup.js` | Test environment setup |
| `generate-asset-html.test.ts` | Unit tests for API endpoint |
| `README.md` | Detailed test documentation |
| `E2E-MANUAL-TESTING-CHECKLIST.md` | Manual testing procedures |

## Resources

- Full test documentation: `src/app/api/gtm/__tests__/README.md`
- Manual testing checklist: `src/app/api/gtm/__tests__/E2E-MANUAL-TESTING-CHECKLIST.md`
- Task summary: `../../Brand/gtm/TASK-8-TEST-SUMMARY.md`
- Jest docs: https://jestjs.io/docs/getting-started
- Next.js testing: https://nextjs.org/docs/testing

## Quick Checklist Before Committing

- [ ] Run `npm test` - all tests pass
- [ ] Run `npm run test:coverage` - coverage >90%
- [ ] No console errors or warnings
- [ ] Tests complete in <5 seconds
- [ ] Manual checklist completed on one solution
- [ ] Generated files appear in `/public/gtm/`

## Support

For test failures:
1. Read the error message carefully
2. Check the specific test case in `generate-asset-html.test.ts`
3. Look at the API implementation in `generate-asset-html/route.ts`
4. Consult `README.md` troubleshooting section
5. Ask team for help if stuck

---

That's it! You're ready to test. Run `npm test` to get started.
