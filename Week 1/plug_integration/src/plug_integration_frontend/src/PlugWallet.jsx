import React, { useEffect } from 'react';

const PlugWallet = () => {
  useEffect(() => {
    const connectPlugWallet = async () => {
      if (window.ic && window.ic.plug) {
        const connected = await window.ic.plug.requestConnect();
        if (connected) {
          console.log('Plug Wallet connected');
        }
      } else {
        console.log('Plug Wallet not installed');
      }
    };

    connectPlugWallet();
  }, []);

  return <div>Plug Wallet Integration</div>;
};

export default PlugWallet;