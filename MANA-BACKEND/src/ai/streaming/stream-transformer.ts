export async function* transformStream<Input, Output>(
  source: AsyncIterable<Input>,
  transform: (item: Input, index: number) => Output | Promise<Output>,
  signal?: AbortSignal,
): AsyncGenerator<Output> {
  let index = 0;
  for await (const item of source) {
    if (signal?.aborted) throw signal.reason;
    yield await transform(item, index);
    index += 1;
  }
}
