# NOTES

zipdotjs.configure() is incremental, it applies (not undefined) configuration props to the current global config.
So make sure to set all props you change for each test.

useCompressionStream
- means use CompressionStream
  - https://nodejs.org/docs/latest-v25.x/api/webstreams.html#class-compressionstream
	- https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream
- will be forced to false when level !== 6
- will ignore chunkSize and level options when true

maxWorkers
- controls how many entries are processed concurrently
- so even if useWebWorkers is false, some multithreading may happen, in particular when useCompressionStream=true
  because the the CompressionStream implementation may use multiple threads internally (4 by default on NODEJS).
	see https://github.com/nodejs/node/blob/main/doc/api/zlib.md#threadpool-usage-and-performance-considerations

useWebWorkers
- controls if a Worker is spawned for each entry concurrently processed
- on NODEJS we can use the web-worker package to have WebWorker support

How do worker threads and libuv threadpool work together on Node.js?
Worker threads run a separate Node instance (separate libuv loop), so libuv's threadpool is created per worker.
UV_THREADPOOL_SIZE determines the size for each worker's pool.
