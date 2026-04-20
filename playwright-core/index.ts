// Core exports - Web Framework
export { PaginaBase } from './web/base/PaginaBase';
export { test, expect } from './web/base/BaseTeste';
export type { BaseFixtures } from './web/base/BaseTeste';

// Componentes
export { Assertiva } from './web/componentes/Assertiva';
export { Botao } from './web/componentes/Botao';
export { CaixaTexto } from './web/componentes/CaixaTexto';
export { Calendario } from './web/componentes/Calendario';
export { CheckkBox } from './web/componentes/CheckkBox';
export { ComboBox } from './web/componentes/ComboBox';
export { Dialog } from './web/componentes/Dialog';
export { Driver } from './web/componentes/Driver';
export { Espera } from './web/componentes/Espera';
export { Filtro } from './web/componentes/Filtro';
export { GerenciadorDeFrames } from './web/componentes/Frame';
export { GeradorDeCPF } from './web/componentes/GeradorDeCPF';
export { LeitorPdf } from './web/componentes/LeitorPdf';
export { PainelMensagem } from './web/componentes/PainelMensagem';
export { Tabela } from './web/componentes/Tabela';
export { AtalhoHelper } from './web/componentes/Teclado';
export { Uploader } from './web/componentes/Uploader';
export { ValidadorDeMensagem } from './web/componentes/ValidadorDeMensagem';

// Utils
export { AllureHelper } from './web/utils/AllureHelper';
export { CapturaDeTela } from './web/utils/CapturaDeTela';
export { DataUtils } from './web/utils/DataUtils';
export { GeradorDeDados } from './web/utils/GeradorDeDados';
export { LeitorDeArquivo } from './web/utils/LeitorDeArquivo';
export { LimpezaDeAmbiente } from './web/utils/LimpezaDeAmbiente';
export { NumeroUtils } from './web/utils/NumeroUtils';
export { TextoUtils } from './web/utils/TextoUtils';
export { Validador } from './web/utils/Validador';
export { configurarAmbiente } from './web/utils/GlobalSetup';
export type { DadosCompletos } from './web/utils/TiposDeDados';
export type { Cenario, DadosTeste } from './web/utils/TiposTeste';
export { DadosCenario } from './web/utils/TiposTeste';
