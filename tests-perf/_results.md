
```
------------------ compstream-noworkers ------------------
{
  "wasmURI": "data:application/wasm;base64,AGFzbQEAAAABRQtgAX8Bf2ACf38AYAJ...",
  "workerURI": "data:text/javascript,(t%3D%3E%7B%22function%22%3D%3Dtypeof%2..."
}
20 x 5MiB useCompressionStream=true  useWebWorkers=false concurrency= 1: zip=3.03s
20 x 5MiB useCompressionStream=true  useWebWorkers=false concurrency= 4: zip=3.00s
20 x 5MiB useCompressionStream=true  useWebWorkers=false concurrency= 8: zip=3.09s




------------------ compstream-workers ------------------
{
  "wasmURI": "data:application/wasm;base64,AGFzbQEAAAABRQtgAX8Bf2ACf38AYAJ...",
  "workerURI": "data:text/javascript,(t%3D%3E%7B%22function%22%3D%3Dtypeof%2..."
}
20 x 5MiB useCompressionStream=true  useWebWorkers=true  concurrency= 1: zip=0.73s
20 x 5MiB useCompressionStream=true  useWebWorkers=true  concurrency= 4: zip=0.73s
20 x 5MiB useCompressionStream=true  useWebWorkers=true  concurrency= 8: zip=0.69s


------------------ purejs-workers ------------------
{
  "wasmURI": null,
  "workerURI": "data:text/javascript;base64,KGU9PnsiZnVuY3Rpb24iPT10eXBlb2Yg..."
}
20 x 5MiB useCompressionStream=false useWebWorkers=true  concurrency= 1: zip=1.40s
20 x 5MiB useCompressionStream=false useWebWorkers=true  concurrency= 4: zip=1.29s
20 x 5MiB useCompressionStream=false useWebWorkers=true  concurrency= 8: zip=1.27s


------------------ purejs-workers ------------------
{
  "wasmURI": "data:application/wasm;base64,AGFzbQEAAAABRQtgAX8Bf2ACf38AYAJ...",
  "workerURI": "data:text/javascript,(t%3D%3E%7B%22function%22%3D%3Dtypeof%2..."
}
20 x 5MiB useCompressionStream=false useWebWorkers=true  concurrency= 1: zip=0.87s
20 x 5MiB useCompressionStream=false useWebWorkers=true  concurrency= 4: zip=0.88s
20 x 5MiB useCompressionStream=false useWebWorkers=true  concurrency= 8: zip=0.85s

```