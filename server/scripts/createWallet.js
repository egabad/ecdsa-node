const { secp256k1 } = require('ethereum-cryptography/secp256k1');
const { keccak256 } = require('ethereum-cryptography/keccak');
const { toHex } = require('ethereum-cryptography/utils');

function generateKeyPair() {
    const privateKey = secp256k1.utils.randomPrivateKey();
    console.log(`private key: ${toHex(privateKey)}`);

    const publicKey = secp256k1.getPublicKey(privateKey);
    console.log(`public key: ${toHex(publicKey)}`);
    const address = keccak256(publicKey.slice(1)).slice(-20);
    console.log(`wallet address: 0x${toHex(address)}`);
}

generateKeyPair();