import { configurarAmbiente } from 'playwright-core';

export default configurarAmbiente({
    url:      'https://devopsadmin.bradesco.com.br:8443/devopsadm/#/index',
    ambiente: process.env.AMBIENTE ?? 'Desenvolvimento',
});
