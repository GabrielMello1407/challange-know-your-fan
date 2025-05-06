
# Know Your Fan - Desafio eSports

## 🎯 Objetivo

O objetivo deste projeto é desenvolver uma solução que permita coletar o máximo de informações sobre fãs de eSports, como parte da estratégia **"Know Your Fan"**, amplamente utilizada por clubes para conhecer melhor seus torcedores e oferecer experiências e serviços personalizados.

Este aplicativo/protótipo foi criado para atender às necessidades de coleta de dados, validação de identidade e integração com redes sociais, com foco em fãs de organizações como a **FURIA**.

---

## 💡 Proposta

A solução desenvolvida inclui as seguintes funcionalidades:

- **Coleta de dados básicos**: Nome, endereço, CPF e email.
- **Upload e validação de documentos**: Envio de documentos (PDF ou imagem) e validação com IA baseada no CPF informado.
- **Integração com redes sociais**: Preenchimento dos dados das redes sociais dos usuarios para compartilhar com outros usuários.
- **Comunidade**: Espaço para personalização de perfis e interação entre fãs.

---

## 🛠 Tecnologias Utilizadas

- **Next.js** – Interface e lógica frontend/backend
- **Supabase** – Banco de dados em nuvem
- **Prisma ORM** – Consultas e gerenciamento do banco de dados
- **Nodemailer** – Envio de e-mails de confirmação
- **Multer e Busboy** – Upload de arquivos
- **Bcrypt** – Hashing de senhas
- **Jose** – Geração/validação de tokens JWT
- **Lucide** – Ícones da interface
- **Mime** – Identificação de tipos de arquivo
- **Zod** – Validação de dados
- **Gemini API** – Validação de documentos e análise de perfis com IA

---

## 🧱 Estrutura do Projeto

- **Landing Page**: Introdução ao produto com login, cadastro e acesso à comunidade.
- **Cadastro e Login**:
  - Cadastro de dados
  - Confirmação de e-mail via Nodemailer
- **Upload de Documentos**:
  - Upload de PDF ou imagem
  - Validação com Gemini API
- **Perfil (Network)**:
  - Personalização com times favoritos, redes sociais e descrição
- **Comunidade**:
  - Exibição de perfis e interação entre fãs

---

## ⚙️ Configuração

### Pré-requisitos

- Node.js v16+
- Conta no [Supabase](https://supabase.com)
- Conta SMTP (ex.: Gmail) para envio de e-mails
- Chave da Gemini API

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
DATABASE_URL="sua_url_do_supabase"
DIRECT_URL="sua_url_direta_do_supabase"
JWT_SECRET="seu_segredo_jwt"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="seu_email@gmail.com"
SMTP_PASS="sua_senha_ou_app_password"
GEMINI_API_KEY="sua_chave_gemini_api"
```

---

## 🚀 Instalação

Clone o repositório:

```bash
git clone https://github.com/seu_usuario/know-your-fan.git
cd know-your-fan
```

Instale as dependências:

```bash
npm install
```

Configure o banco de dados com Prisma:

```bash
npx prisma generate
npx prisma db push
```

Inicie o projeto:

```bash
npm run dev
```

Acesse em: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Uso

1. Acesse a **Landing Page** e clique em "Cadastro" ou "Login".
2. Crie uma conta preenchendo os dados. Confirme via e-mail.
3. Após login, vá para o perfil e envie um documento (PDF/imagem).
4. A IA validará seu CPF e autenticidade do documento.
5. Personalize seu perfil com times, redes sociais e descrição.
6. Acesse a aba **Comunidade** para ver e interagir com outros fãs!

---

