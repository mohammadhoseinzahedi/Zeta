import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

type LoaderFunction<T, Props> = (page: number, props: Props) => Promise<T[]>;

export const useInfiniteScroll = <T, Props>(
  initialData: T[],
  loader: LoaderFunction<T, Props>,
  loaderProps: Props
) => {
  const [data, setData] = useState<T[]>(initialData || []);
  const [status, setStatus] = useState({
    page: initialData ? 1 : 0,
    hasMore: true,
    error: false,
  });
  const { ref, inView } = useInView();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loadedData = await loader(status.page + 1, loaderProps);
        if (!loadedData.length)
          setStatus((prev) => ({ ...prev, hasMore: false }));
        setData((prev) => [...prev, ...loadedData]);
        setStatus((prev) => ({ ...prev, page: prev.page + 1, error: false }));
      } catch {
        setStatus((prev) => ({ ...prev, error: true }));
      }
    };
    if (inView && status.hasMore) fetchData();
  }, [inView]);

  return { data, status, ref, setData, setStatus };
};

export default useInfiniteScroll;
