import { HttpAgent, Actor } from '@dfinity/agent';
import { idlFactory } from '../plug_integration_backend/plug_integration_backend.did.js'; // Adjust the path as needed

const canisterId = 'rdmx6-jaaaa-aaaaa-aaadq-cai';
const agent = new HttpAgent({ host: 'https://ic0.app' });

const createActor = (canisterId, agent) => {
  return Actor.createActor(idlFactory, { agent, canisterId });
};

export const canisterActor = createActor(canisterId, agent);
