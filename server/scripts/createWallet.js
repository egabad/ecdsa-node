const { secp256k1 } = require('ethereum-cryptography/secp256k1');
const { keccak256 } = require('ethereum-cryptography/keccak');
const { toHex } = require('ethereum-cryptography/utils');

function generateKeyPair() {
  const privateKey = secp256k1.utils.randomPrivateKey();
  console.log(`private key: ${toHex(privateKey)}`); // eslint-disable-line

  const publicKey = secp256k1.getPublicKey(privateKey);
  console.log(`public key: ${toHex(publicKey)}`); // eslint-disable-line
  const address = keccak256(publicKey.slice(1)).slice(-20);
  console.log(`wallet address: 0x${toHex(address)}`); // eslint-disable-line
}

generateKeyPair();
