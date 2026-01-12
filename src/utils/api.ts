
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; 
const cache = new Map<string, CacheItem<any>>();

export const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`Cache hit for: ${key}`);
    return cached.data;
  }
  return null;
};

export const setCachedData = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
  console.log(`Cache set for: ${key}`);
};

export const clearCache = () => {
  cache.clear();
  console.log('Cache cleared');
};

export const fetchWithCache = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  setCachedData(cacheKey, data);
  
  return data;
};