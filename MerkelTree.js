const sha256 = require("./helper");

class MerkelTree {

	// root stores all the layers
	constructor() {
		this.root = [];
	}

	// Creates all the layers of thr tree for the given transaction list
	/**
		* The `createTree` method takes an array of transaction objects and constructs
		* the Merkle tree layers, which are stored in the `root` property of the class.
		* It follows these steps:
		*
		* 1. Add the original `transactionList` as the first (bottom) layer of the `root` array.
		* 2. Add an array of hashes, calculated from the transactions in the `transactionList`,
		*    as the second layer of the `root` array.
		* 3. While the length of the bottom layer (first element of `root`) is greater than 1:
		*    a. Create an empty temporary array `temp`.
		*    b. Iterate over the bottom layer with a step size of 2.
		*    c. For each pair of hashes:
		*       i. If the current index is even and not the last index,
		*          calculate the SHA-256 hash of the concatenation of the current hash
		*          and the next hash, and push the result to `temp`.
		*       ii. If the current index is odd or the last index,
		*           push the current hash to `temp`.
		*    d. Add the `temp` array as the new bottom layer of the `root` array.
		* 4. Repeat step 3 until the length of the bottom layer is 1, representing the root hash.
		*
		* The resulting `root` will contain the Merkle tree layers, with each element
		* representing a layer, and the first element being the root hash.
		* The unshift method adds this new array to the beginning of the root array.
	**/

	createTree(transactionList) {
		this.root.unshift(transactionList);
		this.root.unshift(transactionList.map(t => t.hash));

		while (this.root[0].length > 1) {
			let temp = [];

			for (let index = 0; index < this.root[0].length; index += 2) {
				if (index < this.root[0].length - 1 && index % 2 == 0)
					temp.push(sha256(this.root[0][index] + this.root[0][index + 1]));
				else temp.push(this.root[0][index]);
			}

			this.root.unshift(temp);
		}
	}

	// Checks if the transaction is valid or not

	/**
		*The `verify` method checks whether the given transaction is included in the Merkle tree and whether its hash
		* is consistent with the root hash of the tree. It follows these steps:
		*
		* 1. Find the position (index) of the transaction's hash in the bottom layer (leaf nodes) of the Merkle tree.
		* 2. Log a message indicating the position at which the transaction was found in the bottom layer.
		* 3. If the transaction was found in the bottom layer:
		*    a. Initialize a `verifyHash` variable with the hash of the transaction.
		*    b. Start a loop that iterates over the layers of the Merkle tree in reverse order, starting from the second-to-last layer.
		*    c. Within the loop:
		*       i. If the `position` is even:
		*          - Set `neighbour` to the next hash in the same layer.
		*          - Update `position` to the index of the parent node in the next layer.
		*          - Update `verifyHash` by calculating the SHA-256 hash of the concatenation of `verifyHash` and `neighbour`.
		*       ii. If the `position` is odd:
		*           - Set `neighbour` to the previous hash in the same layer.
		*           - Update `position` to the index of the parent node in the next layer.
		*           - Update `verifyHash` by calculating the SHA-256 hash of the concatenation of `neighbour` and `verifyHash`.
		*    d. After the loop completes, log a message indicating whether the calculated `verifyHash` matches the root hash stored in the tree.
		* 4. If the transaction was not found in the bottom layer, log a message "Data not found with the id".
		*
		* The `verify` method is used to validate the integrity of a transaction within a Merkle tree data structure.
		* It checks whether the transaction is included in the tree and whether its hash contributes to the root hash correctly.
		* This verification process is essential in blockchain and other applications where data integrity is crucial.
	**/
	verify(transaction) {
		let position = this.root.slice(-1)[0].findIndex(t => t.hash == transaction.hash);
		console.log("Element found at: " + position);
		if (position) {

			let verifyHash = transaction.getHash();

			for (let index = this.root.length - 2; index > 0; index--) {

				let neighbour = null;
				if (position % 2 == 0) {
					neighbour = this.root[index][position + 1];
					position = Math.floor((position) / 2)
					verifyHash = sha256(verifyHash + neighbour);
				}
				else {
					neighbour = this.root[index][position - 1];
					position = Math.floor((position - 1) / 2)
					verifyHash = sha256(neighbour + verifyHash);
				}

			}
			console.log(verifyHash == this.root[0][0] ? "Valid" : "Not Valid");
		}
		else {
			console.log("Data not found with the id");

		}
	}
}

module.exports = MerkelTree;