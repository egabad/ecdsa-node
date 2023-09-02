import { keccak256 } from 'ethereum-cryptography/keccak';
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils';
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { useState } from "react";
import server from "./server";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const msg = {
      sender: address,
      amount: parseInt(sendAmount),
      recipient
    };

    try {
      // Hash msg
      const msgHash = toHex(keccak256(utf8ToBytes(JSON.stringify(msg))));

      // Sign hashed msg
      const signature = secp256k1.sign(msgHash, privateKey, { recovery: true });

      // Get nonce
      const { data: { nonce }} = await server.get(`nonce/${address}`);

      const { data: { balance }} = await server.post(`send`, {
        msg,
        msgHash,
        nonce,
        signature: signature.toCompactHex(),
        recoveryBit: signature.recovery,
      });
      setBalance(balance);
    } catch (err) {
      alert(err.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Enter a valid Ethereum address"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
