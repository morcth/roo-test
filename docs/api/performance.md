# Performance Benchmarking

Performance benchmarks for the Trie data structure are implemented using Vitest's benchmarking capabilities.

## Methodology

Benchmark tests are located in [`src/__tests__/benchmark.test.ts`](src/__tests__/benchmark.test.ts). These tests measure the execution time of key Trie operations:

- `insert()`: Benchmarks the time taken to insert a specified number of words into the Trie.
- `search()`: Benchmarks the time taken to search for a specified number of words in a pre-populated Trie.
- `delete()`: Benchmarks the time taken to delete a specified number of words from a pre-populated Trie.

The tests use `performance.now()` to measure the duration of the operations.

## Configuration

Performance thresholds are configured in [`vitest.config.ts`](vitest.config.ts). The `benchmark` property in the test configuration specifies:

- `enabled`: Enables benchmark tests.
- `outputFile`: Specifies the file to output benchmark results (e.g., `./test-results/benchmark.json`).
- `reporters`: Configures the benchmark reporters (e.g., `verbose`).
- `thresholds`: Sets performance thresholds for individual benchmark tests. If a test exceeds its threshold, it will be marked as a failure.

Example thresholds configured in `vitest.config.ts`:

```typescript
benchmark: {
  enabled: true,
  outputFile: './test-results/benchmark.json',
  reporters: ['verbose'],
  thresholds: {
    'Trie Performance Benchmarks > should insert 1000 words': 50, // ms
    'Trie Performance Benchmarks > should search for 1000 words': 30, // ms
    'Trie Performance Benchmarks > should delete 1000 words': 70, // ms
  },
},
```

These thresholds can be adjusted based on performance requirements and testing environment.

## CI Integration

Performance benchmarks are integrated into the CI workflow to track performance over time and prevent regressions. The CI workflow performs the following steps:

1. **Run Benchmarks**: The `npm run test:benchmark` command is executed to run the performance tests.
2. **Upload Artifact**: The benchmark results file (`test-results/.last-run.json`) is uploaded as a build artifact. This allows for downloading and analyzing the results of each CI run.
3. **Performance Threshold Check**: A step is included to check the benchmark results against the configured thresholds in [`vitest.config.ts`](vitest.config.ts). If any benchmark exceeds its threshold, the CI job will fail.

This integration ensures that performance is continuously monitored and that any significant performance degradation is caught early in the development process.

## Recent Performance Improvements (Ticket #16)

Following the completion of Ticket #16, significant performance improvements have been implemented. New benchmark metrics reflect these enhancements, particularly in areas related to [mention specific areas if known, otherwise keep general]. Updated thresholds in [`vitest.config.ts`](vitest.config.ts) reflect the improved performance characteristics.

## Input Validation

Input to the API is subject to validation to ensure data integrity and prevent unexpected behavior.

### Character Limit

Input strings are limited to a maximum length of 64 characters. Any input exceeding this limit will be rejected.

### Allowed Character Set

Input strings must only contain characters from the following set: `a-z`, `A-Z`, `0-9`, and space. Input containing characters outside this set will be rejected.

### Error Message Examples

When input validation fails, the API will return specific error messages. Examples include:

- `Error: Input exceeds maximum length of 64 characters.`
- `Error: Input contains disallowed characters.`

These messages are designed to be informative and help users understand the reason for the validation failure.

## Input Sanitization

Input to the API is also subject to sanitization to clean and normalize user input before processing.

### Sanitization Methods

The following sanitization methods are implemented:

- **Trimming**: Leading and trailing whitespace is removed from the input string.
- **Non-printables**: Non-printable characters are removed.
- **Space Collapsing**: Multiple consecutive spaces are collapsed into a single space.
- **HTML Entity Preservation**: HTML entities (e.g., `&`, `<`) are preserved and not decoded or removed.

### Integration with Permutation Engine

Input sanitization is performed _before_ the input string is passed to the permutation engine. This ensures that the engine operates on clean and normalized data, preventing unexpected behavior or incorrect permutations due to malformed input.

### Performance Considerations

While input sanitization adds a small overhead, it is generally negligible compared to the permutation engine's processing time. No specific performance thresholds have been defined for the sanitization process at this time.

## Accessibility Implementation Notes

- **Error Reporting**: Validation errors are clearly communicated to users, including those using assistive technologies. Error messages are associated with the input field using `aria-describedby` to ensure screen readers announce the error.
- **Focus Management**: When a validation error occurs, focus is programmatically moved to the input field or the associated error message to alert users.
- **ARIA Attributes**: The input field utilizes `aria-invalid` to indicate an invalid state and `aria-live` regions are used for dynamic error message updates to ensure they are announced by screen readers without interrupting the user flow.
