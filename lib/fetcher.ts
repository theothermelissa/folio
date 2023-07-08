const fetcher = (url: string, ...args: any) =>
  fetch(url, ...args).then((res) => res.json());

export default fetcher;
