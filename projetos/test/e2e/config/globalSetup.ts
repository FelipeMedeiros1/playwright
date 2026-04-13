import { configurarAmbiente } from 'playwright-core';

export default configurarAmbiente({
    url:      'https://sua-url-aqui.com',
    ambiente: process.env.AMBIENTE ?? 'Desenvolvimento',
});
