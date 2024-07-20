import { createContext, useContext, useEffect, useState } from "react";
import Web3 from "web3";

const Web3Context = createContext();

function Web3Provider({ children }) {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(function () {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccounts(accounts);
        setSelectedAccount(accounts[0]);
      } else {
        throw new Error("Metamask not detected.");
      }
    };
    initWeb3();
  }, []);

  function handleAccountChange(newAccount) {
    setSelectedAccount(newAccount);
  }

  return (
    <Web3Context.Provider
      value={{
        web3,
        accounts,
        selectedAccount,
        handleAccountChange,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("Web3 Context cannot be used outside Web3 Provider");
  }
  return context;
}

export { Web3Provider, useWeb3 };
