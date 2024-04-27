class PatriciaTrie {
	constructor() {
		this.root = {};
	}

	// Add transaction to the trie
	/**
		* The `add` method adds a transaction to the Merkle tree data structure by traversing
		* the tree based on the characters of the transaction's hash. It follows these steps:
		*
		* 1. Create a temporary reference `temporaryRoot` to the root of the tree (`this.root`).
		* 2. Convert the transaction's hash to a string (`transaction.hash`).
		* 3. Iterate over each character of the hash string:
		*    a. If the current character does not exist as a key in the `temporaryRoot` object,
		*       create a new empty object and assign it to that key.
		*    b. Update `temporaryRoot` to the object associated with the current character.
		* 4. After the loop completes, `temporaryRoot` will point to the leaf node where the transaction should be added.
		* 5. Add the transaction object to the `temporaryRoot` object under the key "DATA".
		*
		* This method effectively creates or traverses a trie-like data structure based on the characters
		* of the transaction's hash, allowing for efficient storage and retrieval of transactions in the Merkle tree.
	*/
	add(transaction) {
		let temporaryRoot = this.root;
		let str = transaction.hash;

		for (let i = 0; i < str.length; i++) {
			let character = str[i];
			if (temporaryRoot[character] == undefined) {
				temporaryRoot[character] = {};
			}
			temporaryRoot = temporaryRoot[character];
		}
		temporaryRoot["DATA"] = transaction;
	}

	// Get transaction from the trie for the passed trie
	get(hash) {
		let temporaryRoot = this.root;

		for (let index = 0; index < hash.length; index++) {
			if (temporaryRoot) temporaryRoot = temporaryRoot[hash[index]];
			else return null;
		}
		if (temporaryRoot["DATA"]) return temporaryRoot["DATA"];
		else return null;
	}

	// Remove the trnasaction with the hash if found
	remove(hash) {
		let temporaryRoot = this.root;

		for (let index = 0; index < hash.length; index++) {
			if (temporaryRoot) temporaryRoot = temporaryRoot[hash[index]];
			else return false;
		}
		if (temporaryRoot["DATA"]) {
			delete temporaryRoot["DATA"];
			return true;
		} else return false;
	}
}

module.exports = PatriciaTrie