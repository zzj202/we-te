import { Storage, StorageValue } from 'unstorage'

class KVService {
  private storage: Storage
  private prefix: string

  constructor(storage: Storage, prefix: string = 'redis:') {
    this.storage = storage
    this.prefix = prefix
  }

  async set<T = any>(key: string, value: StorageValue, ttl?: number): Promise<void> {
    const prefixedKey = this.getPrefixedKey(key)
    await this.storage.setItem(prefixedKey, value)
    
    if (ttl) {
      const timeoutKey = this.getPrefixedKey(`timeout:${key}`)
      setTimeout(async () => {
        await this.storage.removeItem(prefixedKey)
        await this.storage.removeItem(timeoutKey)
      }, ttl * 1000)
      await this.storage.setItem(timeoutKey, Date.now() + ttl * 1000)
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    const prefixedKey = this.getPrefixedKey(key)
    const timeoutKey = this.getPrefixedKey(`timeout:${key}`)
    
    const timeout = await this.storage.getItem<number>(timeoutKey)
    if (timeout && Date.now() > timeout) {
      await this.storage.removeItem(prefixedKey)
      await this.storage.removeItem(timeoutKey)
      return null
    }
    
    return await this.storage.getItem<T>(prefixedKey)
  }

  async delete(key: string): Promise<void> {
    const prefixedKey = this.getPrefixedKey(key)
    const timeoutKey = this.getPrefixedKey(`timeout:${key}`)
    
    await this.storage.removeItem(prefixedKey)
    await this.storage.removeItem(timeoutKey)
  }

  async has(key: string): Promise<boolean> {
    const value = await this.get(key)
    return value !== null
  }

  private getPrefixedKey(key: string): string {
    return `${this.prefix}${key}`
  }
}

let kvService: KVService

export function useKV(prefix?: string): KVService {
  if (!kvService) {
    const storage = useStorage()
    kvService = new KVService(storage, prefix)
  }
  return kvService
}