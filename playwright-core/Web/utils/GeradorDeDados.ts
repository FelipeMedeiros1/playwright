import { faker } from '@faker-js/faker/locale/pt_BR';
import { DadosCompletos } from './TiposDeDados'; // ajuste o path conforme seu projeto

export class GeradorDeDados {
    private removerAcentosESpeciais(texto: string): string {
        return texto
            .normalize('NFD') // separa letras dos acentos
            .replace(/[\u0300-\u036f]/g, '') // remove acentos
            .replace(/[^a-zA-Z0-9\s]/g, ''); // remove caracteres especiais
    }

    nomeCompleto(): string {
        return this.removerAcentosESpeciais(faker.person.fullName());
    }

    nome(): string {
        // return this.removerAcentosESpeciais('@Qa' + faker.string.alpha({ length: 2 }));
        return this.removerAcentosESpeciais(faker.person.firstName());
    }

    sobrenome(): string {
        return this.removerAcentosESpeciais(faker.person.lastName());
    }

    email(): string {
        const nome = this.nome().toLowerCase();
        const sobrenome = this.sobrenome().toLowerCase();
        return `${nome}.${sobrenome}@teste.com`.toLowerCase();
    }

    telefoneCelular(): string {
        return faker.phone.number({ style: 'human' });
    }

    cpf(): string {
        return faker.helpers.replaceSymbols('###########');
    }

    senha(tamanho = 8): string {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let senha = '';
        for (let i = 0; i < tamanho; i++) {
            const index = Math.floor(Math.random() * caracteres.length);
            senha += caracteres[index];
        }
        return senha;
    }

    enderecoCompleto(): string {
        return this.removerAcentosESpeciais(
            `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()} - ${faker.location.zipCode('#####-###')}`
        );
    }

    nomeDaRua(): string {
        return this.removerAcentosESpeciais(faker.location.streetAddress());
    }

    cep(): string {
        return faker.location.zipCode('#####-###');
    }

    cidade(): string {
        return this.removerAcentosESpeciais(faker.location.city());
    }

    estado(): string {
        return this.removerAcentosESpeciais(faker.location.state());
    }

    dataNascimento(idadeMin = 18, idadeMax = 60): string {
        const nascimento = faker.date.birthdate({ min: idadeMin, max: idadeMax, mode: 'age' });
        return nascimento.toLocaleDateString('pt-BR');
    }

    usuario(): string {
        const nome = this.nome().toLowerCase();
        const alfanumerico = faker.string.alphanumeric();
        return this.removerAcentosESpeciais(`${nome}`);
    }

    gerarDados(): DadosCompletos {
        const nome = this.nome();
        const sobrenome = this.sobrenome();
        const email = this.email();
        const usuario = this.usuario();
        const senha = this.senha();
        const telefone = this.telefoneCelular();
        const cpf = this.cpf();
        const nomeDaRua = this.nomeDaRua();
        const cep = this.cep();
        const cidade = this.cidade();
        const estado = this.estado();
        const nascimento = this.dataNascimento();

        return {
            nome,
            sobrenome,
            email,
            usuario,
            senha,
            telefone,
            cpf,
            nomeDaRua,
            cep,
            cidade,
            estado,
            nascimento
        };
    }
}
