import React, { useState, useEffect } from 'react';
import { plug_integration_backend } from 'declarations/plug_integration_backend';
import PlugWallet from './PlugWallet.jsx';

function App() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Internet Identity Authentication
    const authenticate = async () => {
      const identity = await window.ic.identity.request();
      if (identity) {
        console.log('Internet Identity authenticated');
      }
    };

    authenticate();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    plug_integration_backend.greet(name).then((greeting) => {
      setGreeting(greeting);
    });
    return false;
  }

  return (
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <br />
      <PlugWallet />
      <form action="#" onSubmit={handleSubmit}>
        <label htmlFor="name">Enter your name: &nbsp;</label>
        <input id="name" alt="Name" type="text" />
        <button type="submit">Click Me!</button>
      </form>
      <section id="greeting">{greeting}</section>
    </main>
  );
}

export default App;