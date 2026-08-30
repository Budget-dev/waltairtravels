/**
 * High-Performance In-Memory LRU Cache with Time-To-Live (TTL)
 * O(1) get, set, delete operations with Doubly Linked List + Map
 * Designed for sub-millisecond route estimations, fare lookups, and AI query memoization.
 */

interface CacheNode<K, V> {
  key: K;
  value: V;
  expiry: number;
  prev: CacheNode<K, V> | null;
  next: CacheNode<K, V> | null;
}

export interface CacheStats {
  size: number;
  maxCapacity: number;
  hits: number;
  misses: number;
  evictions: number;
  hitRatio: number;
}

export class LRUCache<K, V> {
  private capacity: number;
  private defaultTTLMs: number;
  private map: Map<K, CacheNode<K, V>> = new Map();
  private head: CacheNode<K, V> | null = null;
  private tail: CacheNode<K, V> | null = null;
  private hits: number = 0;
  private misses: number = 0;
  private evictions: number = 0;

  constructor(capacity: number = 1000, defaultTTLMs: number = 10 * 60 * 1000) {
    this.capacity = capacity;
    this.defaultTTLMs = defaultTTLMs;
  }

  public get(key: K): V | null {
    const node = this.map.get(key);
    if (!node) {
      this.misses++;
      return null;
    }

    // Check expiration
    if (Date.now() > node.expiry) {
      this.deleteNode(node);
      this.map.delete(key);
      this.misses++;
      return null;
    }

    // Move to front (most recently used)
    this.moveToHead(node);
    this.hits++;
    return node.value;
  }

  public set(key: K, value: V, ttlMs?: number): void {
    const ttl = ttlMs ?? this.defaultTTLMs;
    const expiry = Date.now() + ttl;

    const existingNode = this.map.get(key);
    if (existingNode) {
      existingNode.value = value;
      existingNode.expiry = expiry;
      this.moveToHead(existingNode);
      return;
    }

    // Evict least recently used if at capacity
    if (this.map.size >= this.capacity) {
      this.evictTail();
    }

    const newNode: CacheNode<K, V> = {
      key,
      value,
      expiry,
      prev: null,
      next: this.head,
    };

    if (this.head) {
      this.head.prev = newNode;
    }
    this.head = newNode;
    if (!this.tail) {
      this.tail = newNode;
    }

    this.map.set(key, newNode);
  }

  public delete(key: K): boolean {
    const node = this.map.get(key);
    if (!node) return false;
    this.deleteNode(node);
    this.map.delete(key);
    return true;
  }

  public clear(): void {
    this.map.clear();
    this.head = null;
    this.tail = null;
  }

  private moveToHead(node: CacheNode<K, V>): void {
    if (node === this.head) return;

    this.detachNode(node);

    node.prev = null;
    node.next = this.head;
    if (this.head) {
      this.head.prev = node;
    }
    this.head = node;

    if (!this.tail) {
      this.tail = node;
    }
  }

  private detachNode(node: CacheNode<K, V>): void {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
  }

  private deleteNode(node: CacheNode<K, V>): void {
    this.detachNode(node);
    node.prev = null;
    node.next = null;
  }

  private evictTail(): void {
    if (!this.tail) return;
    const tailNode = this.tail;
    this.deleteNode(tailNode);
    this.map.delete(tailNode.key);
    this.evictions++;
  }

  public getStats(): CacheStats {
    const totalRequests = this.hits + this.misses;
    return {
      size: this.map.size,
      maxCapacity: this.capacity,
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
      hitRatio: totalRequests === 0 ? 1 : Number((this.hits / totalRequests).toFixed(4)),
    };
  }
}

// Global shared cache instances
export const fareCache = new LRUCache<string, any>(500, 15 * 60 * 1000); // 15 mins
export const routeCache = new LRUCache<string, any>(1000, 60 * 60 * 1000); // 1 hour
export const aiResponseCache = new LRUCache<string, any>(200, 30 * 60 * 1000); // 30 mins
