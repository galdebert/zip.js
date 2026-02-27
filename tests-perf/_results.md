

# CHROME

`npm run test-browser`

```
compstream
20 x 5MiB concurrency = 1: zip = 3.10 s   unzip = 0.67 s   size = 94.04 MiB
20 x 5MiB concurrency = 2: zip = 1.78 s   unzip = 0.55 s   size = 94.04 MiB
20 x 5MiB concurrency = 4: zip = 1.04 s   unzip = 0.56 s   size = 94.05 MiB
20 x 5MiB concurrency = 8: zip = 0.75 s   unzip = 0.58 s   size = 94.04 MiB


purejs
20 x 5MiB concurrency = 1: zip = 6.59 s   unzip = 1.74 s   size = 94.84 MiB
20 x 5MiB concurrency = 2: zip = 3.49 s   unzip = 1.01 s   size = 94.84 MiB
20 x 5MiB concurrency = 4: zip = 1.93 s   unzip = 0.65 s   size = 94.84 MiB
20 x 5MiB concurrency = 8: zip = 1.37 s   unzip = 0.62 s   size = 94.84 MiB


wasm
20 x 5MiB concurrency = 1: zip = 4.90 s   unzip = 0.93 s   size = 94.30 MiB
20 x 5MiB concurrency = 2: zip = 2.58 s   unzip = 0.60 s   size = 94.31 MiB
20 x 5MiB concurrency = 4: zip = 1.42 s   unzip = 0.47 s   size = 94.30 MiB
20 x 5MiB concurrency = 8: zip = 0.97 s   unzip = 0.53 s   size = 94.30 MiB
```


# FIREFOX

```
compstream
20 x 5MiB concurrency = 1: zip = 4.26 s   unzip = 1.30 s   size = 94.31 MiB
20 x 5MiB concurrency = 2: zip = 2.29 s   unzip = 0.91 s   size = 94.31 MiB
20 x 5MiB concurrency = 4: zip = 1.32 s   unzip = 0.93 s   size = 94.31 MiB
20 x 5MiB concurrency = 8: zip = 1.00 s   unzip = 0.94 s   size = 94.31 MiB


purejs
20 x 5MiB concurrency = 1: zip = 9.21 s   unzip = 2.82 s   size = 94.84 MiB
20 x 5MiB concurrency = 2: zip = 4.86 s   unzip = 1.54 s   size = 94.84 MiB
20 x 5MiB concurrency = 4: zip = 2.78 s   unzip = 0.99 s   size = 94.84 MiB
20 x 5MiB concurrency = 8: zip = 1.79 s   unzip = 1.01 s   size = 94.84 MiB

wasm
20 x 5MiB concurrency = 1: zip = 4.79 s   unzip = 1.23 s   size = 94.30 MiB
20 x 5MiB concurrency = 2: zip = 2.51 s   unzip = 0.88 s   size = 94.31 MiB
20 x 5MiB concurrency = 4: zip = 1.43 s   unzip = 0.87 s   size = 94.30 MiB
20 x 5MiB concurrency = 8: zip = 1.05 s   unzip = 0.90 s   size = 94.31 MiB
```


# NODEJS

`npm run test-node-perf-all`

```
compstream-noworkers
20 x 5MiB concurrency = 8: zip = 1.42s   unzip = 0.54s   size = 93.84MiB

compstream
20 x 5MiB concurrency = 1: zip = 3.31s   unzip = 0.96s   size = 93.84 MiB
20 x 5MiB concurrency = 2: zip = 1.81s   unzip = 0.68s   size = 93.84 MiB
20 x 5MiB concurrency = 4: zip = 1.15s   unzip = 0.60s   size = 93.84 MiB
20 x 5MiB concurrency = 8: zip = 1.02s   unzip = 0.63s   size = 93.84 MiB

purejs
20 x 5MiB concurrency = 1: zip = 6.92s   unzip = 2.00s   size = 94.44 MiB
20 x 5MiB concurrency = 2: zip = 3.63s   unzip = 1.18s   size = 94.44 MiB
20 x 5MiB concurrency = 4: zip = 2.13s   unzip = 0.83s   size = 94.43 MiB
20 x 5MiB concurrency = 8: zip = 1.61s   unzip = 0.85s   size = 94.44 MiB

wasm
20 x 5MiB concurrency = 1: zip = 4.85s   unzip = 0.91s   size = 94.08 MiB
20 x 5MiB concurrency = 2: zip = 2.53s   unzip = 0.56s   size = 94.08 MiB
20 x 5MiB concurrency = 4: zip = 1.56s   unzip = 0.49s   size = 94.08 MiB
20 x 5MiB concurrency = 8: zip = 1.13s   unzip = 0.70s   size = 94.08 MiB
```
