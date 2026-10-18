# Why `performance.memory` and the Chrome Tab Tooltip Show Different Numbers

## Chrome tab hover tooltip

This is the **OS-level resident memory** of the renderer process — specifically, the physical RAM pages actually mapped into the process right now. On macOS this number is further compressed by the OS memory compression system (LZVN), which can achieve 2–4× ratios on JavaScript heap data. So "389 MB" means roughly 389 MB of _physical_ RAM after macOS has compressed inactive pages.

## `performance.memory.usedJSHeapSize`

This is the **V8 logical JS heap** — the total bytes of live JavaScript objects V8 currently considers "in use." This is a _virtual/logical_ view, uncompressed and unrelated to how many pages are actually resident in RAM.

---

## Why a large logical heap → small physical footprint is completely normal

1. **macOS memory compression** is the biggest factor. The OS compresses cold heap pages in the background. A 1090 MB JS heap full of structured data (arrays of objects, typed arrays) can compress down to a third of its size trivially.

2. **Not all heap pages are resident.** V8 allocates virtual address space eagerly, but the OS only loads pages into physical RAM on demand. Pages that haven't been touched recently get evicted or compressed.

3. **They're sampled at different moments.** The tab tooltip is updated on Chrome's own schedule; the `performance.memory` poll runs every 2 seconds. Memory can spike and fall between samples.

4. **`performance.memory` is quantized by Chrome** (since ~2020, for Spectre mitigation). The values are rounded to the nearest ~100 KB bucket, adding additional imprecision.

---

## The takeaway

For detecting that a simulation is eating too much memory, **`usedJSHeapSize` is the better signal** — it tells you how much live JavaScript data V8 is holding, which is exactly what you want to watch as simulation data accumulates. The Chrome tab number tells you about physical RAM pressure after the OS has done its compression work, which is a lagging and indirect indicator.
