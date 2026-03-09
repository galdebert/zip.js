

# CHROME

`npm run test-browser`

```
compstream
32 x 5MiB concurrency =  1   zip = 5.81 s   unzip = 1.15 s   size = 150.47 MiB
32 x 5MiB concurrency =  2   zip = 3.06 s   unzip = 0.97 s   size = 150.47 MiB
32 x 5MiB concurrency =  4   zip = 1.71 s   unzip = 0.98 s   size = 150.47 MiB
32 x 5MiB concurrency =  8   zip = 1.26 s   unzip = 1.03 s   size = 150.47 MiB
32 x 5MiB concurrency = 16   zip = 1.29 s   unzip = 1.35 s   size = 150.47 MiB

purejs
32 x 5MiB concurrency =  1   zip = 11.39 s  unzip = 2.83 s   size = 151.74 MiB
32 x 5MiB concurrency =  2   zip = 5.87 s   unzip = 1.60 s   size = 151.74 MiB
32 x 5MiB concurrency =  4   zip = 3.25 s   unzip = 1.10 s   size = 151.74 MiB
32 x 5MiB concurrency =  8   zip = 2.08 s   unzip = 1.12 s   size = 151.74 MiB
32 x 5MiB concurrency = 16   zip = 1.90 s   unzip = 1.30 s   size = 151.74 MiB

wasm
32 x 5MiB concurrency =  1   zip = 7.77 s   unzip = 1.40 s   size = 150.89 MiB
32 x 5MiB concurrency =  2   zip = 4.08 s   unzip = 0.93 s   size = 150.89 MiB
32 x 5MiB concurrency =  4   zip = 2.24 s   unzip = 0.79 s   size = 150.89 MiB
32 x 5MiB concurrency =  8   zip = 1.36 s   unzip = 0.83 s   size = 150.89 MiB
32 x 5MiB concurrency = 16   zip = 1.09 s   unzip = 0.90 s   size = 150.89 MiB
```

zip:
- compstream is the fastest
- higher concurrency is faster

unzip: 
- compstream is the fastest
- compstream concurrency=2 a but faster than 1, but concurrency>2 is NOT faster 

# FIREFOX

`npm run test-browser`

```
compstream
32 x 5MiB concurrency =  1   zip = 6.80 s   unzip = 2.07 s   size = 150.89 MiB
32 x 5MiB concurrency =  2   zip = 3.68 s   unzip = 1.49 s   size = 150.89 MiB
32 x 5MiB concurrency =  4   zip = 2.16 s   unzip = 1.45 s   size = 150.89 MiB
32 x 5MiB concurrency =  8   zip = 1.52 s   unzip = 1.62 s   size = 150.89 MiB
32 x 5MiB concurrency = 16   zip = 1.80 s   unzip = 1.65 s   size = 150.89 MiB

purejs
32 x 5MiB concurrency =  1   zip = 14.68 s  unzip = 4.52 s   size = 151.74 MiB
32 x 5MiB concurrency =  2   zip = 7.81 s   unzip = 2.51 s   size = 151.74 MiB
32 x 5MiB concurrency =  4   zip = 4.25 s   unzip = 1.58 s   size = 151.74 MiB
32 x 5MiB concurrency =  8   zip = 2.59 s   unzip = 1.62 s   size = 151.74 MiB
32 x 5MiB concurrency = 16   zip = 2.17 s   unzip = 1.83 s   size = 151.74 MiB

wasm
32 x 5MiB concurrency =  1   zip = 7.47 s   unzip = 2.15 s   size = 150.89 MiB
32 x 5MiB concurrency =  2   zip = 4.04 s   unzip = 1.44 s   size = 150.89 MiB
32 x 5MiB concurrency =  4   zip = 2.31 s   unzip = 1.39 s   size = 150.89 MiB
32 x 5MiB concurrency =  8   zip = 1.61 s   unzip = 1.48 s   size = 150.89 MiB
32 x 5MiB concurrency = 16   zip = 1.60 s   unzip = 1.57 s   size = 150.89 MiB
```

zip:
- compstream a bit faster than wasm
- compstream higher concurrency is faster, max out at 8

unzip: 
- compstream and wasm are similar
- compstream concurrency=2 faster than 1, max out at 2


# NODEJS

`npm run test-node-perf-all`

```
compstream-noworkers
32 x 5MiB concurrency =  1   zip = 5.21 s   unzip = 1.16 s   size = 150.14 MiB
32 x 5MiB concurrency =  2   zip = 3.06 s   unzip = 0.76 s   size = 150.14 MiB
32 x 5MiB concurrency =  4   zip = 2.00 s   unzip = 0.58 s   size = 150.14 MiB
32 x 5MiB concurrency =  8   zip = 1.91 s   unzip = 0.61 s   size = 150.14 MiB
32 x 5MiB concurrency = 16   zip = 1.94 s   unzip = 0.64 s   size = 150.14 MiB

compstream
32 x 5MiB concurrency =  1   zip = 5.08 s   unzip = 1.38 s   size = 150.14 MiB
32 x 5MiB concurrency =  2   zip = 2.85 s   unzip = 0.96 s   size = 150.14 MiB
32 x 5MiB concurrency =  4   zip = 1.81 s   unzip = 0.77 s   size = 150.14 MiB
32 x 5MiB concurrency =  8   zip = 1.54 s   unzip = 0.91 s   size = 150.14 MiB
32 x 5MiB concurrency = 16   zip = 1.69 s   unzip = 1.26 s   size = 150.14 MiB

purejs
32 x 5MiB concurrency =  1   zip = 10.84 s  unzip = 3.05 s   size = 151.10 MiB
32 x 5MiB concurrency =  2   zip = 5.72 s   unzip = 1.70 s   size = 151.10 MiB
32 x 5MiB concurrency =  4   zip = 3.68 s   unzip = 1.20 s   size = 151.10 MiB
32 x 5MiB concurrency =  8   zip = 2.18 s   unzip = 1.17 s   size = 151.10 MiB
32 x 5MiB concurrency = 16   zip = 2.15 s   unzip = 1.54 s   size = 151.10 MiB

wasm
32 x 5MiB concurrency =  1   zip = 7.52 s   unzip = 1.33 s   size = 150.53 MiB
32 x 5MiB concurrency =  2   zip = 3.94 s   unzip = 0.85 s   size = 150.53 MiB
32 x 5MiB concurrency =  4   zip = 2.27 s   unzip = 0.74 s   size = 150.53 MiB
32 x 5MiB concurrency =  8   zip = 1.57 s   unzip = 0.90 s   size = 150.53 MiB
32 x 5MiB concurrency = 16   zip = 1.39 s   unzip = 1.40 s   size = 150.53 MiB
```

on NODEJS, comstream and compstream-noworkers uses the internal uv_thread_pool=4 by default,
so each worker has built-in 4x concurrency.

on NODEJS, using **compstream-noworkers with concurrency=4** seems the fastest and simplest.




# big-first vs small-first

## CHROME

```
compstream keepOrder false
small-first concurrency =  2   zip = 2.06 s   unzip = 0.46 s   size = 59.25 MiB
big-first   concurrency =  2   zip = 2.02 s   unzip = 0.42 s   size = 59.25 MiB

compstream keepOrder true
small-first concurrency =  2   zip = 1.64 s   unzip = 0.46 s   size = 59.25 MiB
big-first   concurrency =  2   zip = 1.60 s   unzip = 0.40 s   size = 59.25 MiB
```

# how does zip.js maxWorkers (aka concurrency) work

## when keepOrder = true

zip.js does NOT keep compressed entries in memory more than maxWorkers.
zip.js awaits for the entry N to be written to the destination zip before processing entry N+1.

with maxWorkers=2 ...

### example with various sizes

**increasing sizes**
```
[1][3----][5---------]
[2--][4-------][6-------------------]
```

**decreasing sizes**
```
[1-------------------][3-------][5--]
[2---------]          [4----]   [6]
```

**worst case order**
```
[1-------------------][3---------][5-------]
[2]                   [4--]       [6----]
```

### example with 1 big size

**increasing sizes**
```
[-1-][-3-][-5-]
[-2-][-4-][6-----------------------------------]
```

**decreasing sizes**
```
[1-----------------------------------][-3-][-5-]
[-2-]                                 [-4-][-6-]
```


## when keepOrder = false

This should give zip.js more freedom, so this should be at least faster.
But it's slower for some reason.


## zip.js improvement ? 

Ideally, when `keepOrder=true`, zip.js should be able keep compressed buffers (with a param maxPendingBytes).
This would allow to have the best possible usage of workers independently of entry ordering.

```
[1-------------------][4-----]
[2---------][3-------][5--][6-]
```

```
[1-----------------------------------]
[-2-][-3-][-4-][-5-][-6-]
```

When `keepOrder=false`, it seems maxPendingBytes should not be necessary.
But I don't really understand how `keepOrder=false` works at the moment
