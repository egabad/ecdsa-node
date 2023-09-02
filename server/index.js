const { secp256k1 } = require('ethereum-cryptography/secp256k1');
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0xe3812487280156cfb88ccef31dfa83c0a3c80294": 100,
  "0xee3de0bba330e330f3558e31de5e97090f19632c": 50,
  "0xd12b257923671833e6f2c9d6ed1e230e043dab08": 75,
  "0x4ea8992e69be621247a48dd4323eb8faabea3647": 80,
};

const nonces = {};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.get("/nonce/:address", (req, res) => {
  const { address } = req.params;
  nonces[address] = nonces[address] || 0;
  const nonce = nonces[address];
  res.send({ nonce });
});

app.post("/send", (req, res) => {
  const { msg, msgHash, nonce, signature, recoveryBit } = req.body;
  const { sender, amount, recipient } = msg;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  // Recover public key
  const signatureFromCompact = secp256k1.Signature.fromCompact(signature);
  const publicKey = signatureFromCompact.addRecoveryBit(recoveryBit).recoverPublicKey(msgHash);
  
  // Verify signed message
  const isValid = secp256k1.verify(signatureFromCompact, msgHash, publicKey.toRawBytes(true));
  if (isValid) {
    if (nonce !== nonces[sender]) return res.status(400).send({ message: "Invalid nonce!" });
    if (balances[sender] < amount) return res.status(400).send({ message: "Not enough funds!" });

    balances[sender] -= amount;
    balances[recipient] += amount;
    nonces[sender] = parseInt(nonce) + 1;
    return res.send({ balance: balances[sender] });
  }
  return res.status(401).send({ message: "Invalid authentication!" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
