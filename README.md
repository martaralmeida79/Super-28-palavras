# SuperPalavras - Método das 28 Palavras (2.º Ano) 📚✏️

Aplicação interativa de apoio à aprendizagem e consolidação da **leitura, escrita e consciência fonológica** para alunos do **2.º ano de escolaridade (7 a 8 anos)**, desenvolvida com base no **Método das 28 Palavras** e no **Quadro Silábico Oficial Supermiúdos**.

---

## 🌟 Funcionalidades Principais

- **Quadro Silábico Completo (Páginas 1 e 2)**:
  - Todas as 28 palavras e respetivas matrizes com as vogais (*a, e, i, o, u*).
  - Inclui dígrafos (*nh, lh, ch, qu, rr, ss, ç*), encontros consonantais (*bra, dra, fla*) e sílabas fechadas (*as/es, ar/er, ban/ben, nal/nel*).
  - Fita interativa com o alfabeto (*a A, b B, c C...*).
  - Leitor integrado do PDF oficial Supermiúdos.

- **Sistema de Áudio e Reforço Fonológico**:
  - Pronúncia de sílabas e palavras completas ao clicar em qualquer elemento.
  - Análise e síntese silábica rítmica (*ex: «sa... pa... to... sapato!»*).
  - Voz adaptada em Português de Portugal com fallback sonoro em Web Audio.

- **Jogos Interativos de Associação**:
  - 🎯 **Qual é a Sílaba?**: Identificar a sílaba em falta ou inicial com base na ilustração.
  - 🧩 **Liga Sílaba à Imagem**: Correspondência de cartões e memória visual/auditiva.
  - 🏗️ **Monta Palavras**: Construtor com blocos de sílabas baralhadas.
  - ✏️ **Caderno de Escrita e Caligrafia**: Pauta escolar de duas linhas do 2.º ano, com lápis, borracha, guia tracejado e digitação no teclado.
  - 🎧 **Ditado Silábico**: Discriminação auditiva e identificação fonológica.

- **Alternador de Tipografia Escolar**:
  - Letra minúscula de imprensa (`abc`).
  - Letra MAIÚSCULA de imprensa (`ABC`).
  - Letra manuscrita escolar (`✍️ Cursiva`).

---

## 🚀 Como Publicar no GitHub e Ativar o Deploy (GitHub Pages)

### 1. Inicializar o Repositório Git Localmente
Se ainda não inicializou o Git nesta pasta, execute no seu terminal:

```bash
git init
git add .
git commit -m "feat: versão inicial da aplicação SuperPalavras Método das 28 Palavras"
```

### 2. Criar o Repositório no GitHub
1. Vá a [github.com/new](https://github.com/new).
2. Dê um nome ao repositório (por exemplo: `superpalavras` ou `metodo-28-palavras`).
3. Pode escolher público ou privado.
4. Clique em **Create repository**.

### 3. Associar e Enviar para o GitHub
Copie e execute os comandos fornecidos pelo GitHub (substituindo pelo seu utilizador):

```bash
git branch -M main
git remote add origin https://github.com/SEU_UTILIZADOR/NOME_DO_REPOSITORIO.git
git push -u origin main
```

---

## ⚙️ Ativação do Deploy Automático no GitHub Pages

O projeto já inclui um workflow de automação em `.github/workflows/deploy.yml`. Para ativar o site:

1. No seu repositório no GitHub, clique na aba **Settings** (Definições).
2. No menu lateral esquerdo, clique em **Pages**.
3. Em **Build and deployment** -> **Source**, selecione:
   👉 **GitHub Actions**
4. Pronto! Cada vez que fizer `git push`, o GitHub compila automaticamente e publica a aplicação num endereço público:
   `https://SEU_UTILIZADOR.github.io/NOME_DO_REPOSITORIO/`

---

## 💻 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18, 20 ou superior).

### Instalação e Execução

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento local
npm run dev

# 3. Compilar para produção
npm run build

# 4. Pré-visualizar a versão de produção
npm run preview
```

---

## 📂 Estrutura do Projeto

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automação de deploy para GitHub Pages
├── public/
│   └── assets/aistudio/        # PDF oficial Supermiúdos
├── src/
│   ├── components/
│   │   ├── games/
│   │   │   ├── GuessSyllableGame.tsx   # Jogo "Qual é a Sílaba?"
│   │   │   ├── MatchSyllablesGame.tsx  # Jogo "Liga Sílaba à Imagem"
│   │   │   ├── WordBuilderGame.tsx     # Construtor de Palavras
│   │   │   ├── WritingCanvas.tsx       # Caderno de Escrita e Caligrafia
│   │   │   └── DictationGame.tsx       # Ditado Silábico Auditivo
│   │   ├── Header.tsx                  # Cabeçalho, modos de letra e som
│   │   ├── PdfModal.tsx                # Visualizador do PDF oficial
│   │   ├── QuadroSilabicoView.tsx      # Grelha oficial das 28 palavras
│   │   ├── WordDetailModal.tsx         # Ficha individual de estudo
│   │   └── WordSvgIllustration.tsx     # Ilustrações temáticas
│   ├── data/
│   │   └── words28.ts          # Base de dados oficial das 28 palavras
│   ├── utils/
│   │   ├── audio.ts            # Motor fonológico e síntese de voz
│   │   └── textFormat.ts       # Gestão de tipografia (minúsculas, maiúsculas, cursiva)
│   ├── App.tsx                 # Aplicação principal
│   └── main.tsx                # Entrada React
├── package.json
└── vite.config.ts              # Configuração Vite com caminhos relativos para deploy
```

---

## 📜 Licença

Desenvolvido para fins educativos e pedagógicos de apoio ao 1.º e 2.º anos de escolaridade do Ensino Básico.
