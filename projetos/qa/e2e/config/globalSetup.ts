import { configurarAmbiente } from 'playwright-core';

export default configurarAmbiente({
    url:      'https://portugol.dev',
    ambiente: process.env.AMBIENTE ?? 'Desenvolvimento',
});