/* 
In this implementation, we define a ConsistentHashing class with a constructor that takes two parameters: replicas, which is the number of replicas that should be created for each node, and hashFunction, which is a function that takes a string key and returns a numeric hash value.

Note that this implementation assumes that the hash values returned by the hashFunction are evenly distributed across the numeric range, which is not always the case for all hash functions. It also doesn't handle cases where nodes are added or removed dynamically, which would require some additional logic to update the hash ring.
*/
class ConsistentHashing<T> {
  private nodes: Map<number, T>

  constructor(
    private replicas: number,
    private hashFunction: (key: string) => number,
  ) {
    this.nodes = new Map<number, T>()
  }

  // Adds a node to the hash ring by computing the hash values for each replica of the node and adding them to the internal nodes map.
  public addNode(node: T): void {
    for (let i = 0; i < this.replicas; i++) {
      const hash = this.hashFunction(`${node}:${i}`)
      this.nodes.set(hash, node)
    }
  }

  // Removes a node from the hash ring by computing the hash values for each replica of the node and deleting them from the internal nodes map.
  public removeNode(node: T): void {
    for (let i = 0; i < this.replicas; i++) {
      const hash = this.hashFunction(`${node}:${i}`)
      this.nodes.delete(hash)
    }
  }

  // Takes a key and returns the node that is responsible for handling that key. 
  // To do this, it computes the hash value for the key and then searches the nodes map for the first node whose hash value is greater than or equal to the key's hash value. 
  // If it reaches the end of the map and hasn't found a suitable node, it returns the first node in the map (which will be the node with the smallest hash value).
  public getNode(key: string): T | undefined {
    if (this.nodes.size === 0) {
      return undefined
    }

    const hash = this.hashFunction(key)
    const nodes = Array.from(this.nodes.keys()).sort()

    for (let i = 0; i < nodes.length; i++) {
      const nodeHash = nodes[i]
      if (hash <= nodeHash) {
        return this.nodes.get(nodeHash)!
      }
    }

    // If we have looped back around to the beginning of the ring,
    // return the first node.
    return this.nodes.get(nodes[0])!
  }
}
