# 🎸 RiffHouse Client — AI-Powered E-commerce

<div align="center">

![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build_Tool-purple?style=for-the-badge&logo=vite&logoColor=white)
![PrimeReact](https://img.shields.io/badge/PrimeReact-UI_Kit-blueviolet?style=for-the-badge&logo=primereact&logoColor=white)

![Axios](https://img.shields.io/badge/Axios-Http_Client-yellow?style=for-the-badge&logo=axios&logoColor=black)
![Context API](https://img.shields.io/badge/Context_API-State_Management-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![React Router](https://img.shields.io/badge/React_Router-Navigation-red?style=for-the-badge&logo=reactrouter&logoColor=white)

</div>

## 📖 Sobre o Projeto

**RiffHouse Client** é o front-end moderno e responsivo da plataforma de e-commerce RiffHouse. Desenvolvido com **React 19**, **TypeScript** e **Vite**, o projeto oferece uma SPA (Single Page Application) de alta performance focada na experiência do usuário.

Além das funcionalidades tradicionais de e-commerce, este projeto se diferencia pela integração nativa com um **Agente de IA e RAG (Retrieval-Augmented Generation)**, transformando a navegação em uma experiência de compra assistida e personalizada.

> **🌐 Back-end:** Este projeto consome a [RiffHouse API](https://github.com/DarkMatter015/server-ecommerce).
>
>  **🎥 Serviço de AI:** O projeto utiliza o agente de IA [Service AI](https://github.com/DarkMatter015/ia-service-ecommerce)

---

## 🤖 Destaque: Intelligent Shopping Agent
A grande inovação da RiffHouse é o seu **Assistente Virtual Integrado**, projetado não apenas para suporte, mas para **conversão de vendas**.

### 🧠 Capacidades do Agente
1.  **RAG Especializado (Busca Semântica):** O chat utiliza RAG para consultar a base de dados de produtos em tempo real. O usuário pode perguntar *"Qual a melhor guitarra para tocar metal iniciante?"* e o agente analisará as especificações técnicas do catálogo para recomendar o produto ideal.
2.  **Contexto Autenticado:** Quando o usuário está logado, o agente reconhece sua identidade, permitindo consultas sobre:
    * Status detalhado de pedidos recentes.
    * Histórico de alertas de estoque.
3.  **Persuasão Ética:** O prompt do sistema foi desenhado para atuar como um vendedor especialista, ajudando a quebrar objeções de compra e destacar os benefícios dos instrumentos.

---

## 🏗️ Arquitetura e Decisões Técnicas

O front-end foi construído visando manutenibilidade, tipagem estrita e separação de responsabilidades.

### 📐 Destaques Arquiteturais
* **Context API para Gestão de Estado:** Optou-se por não utilizar Redux/Zustand para manter a arquitetura leve. O estado global é segmentado em Contextos específicos (`AuthContext`, `CartContext`), suficientes para a complexidade atual da aplicação.
* **Camada de Serviço (Service Layer Pattern):** Toda a comunicação com a API (Axios) é isolada em serviços (`/services`). Os componentes de UI desconhecem as URLs ou a lógica HTTP, recebendo apenas dados tipados.
* **Custom Hooks:** Lógica repetitiva (como verificação de autenticação ou manipulação de formulários complexos) foi abstraída em hooks (`useAuth`, `useCart` etc.), mantendo os componentes visuais limpos.
* **Interceptor de Autenticação:** O Axios foi configurado com interceptors para anexar automaticamente o Token JWT em requisições protegidas e tratar expiração de sessão globalmente.

### 🛠️ Tecnologias Principais
* **Core:** React 19 + TypeScript.
* **Build & Tooling:** Vite.
* **UI/UX:** PrimeReact (Componentes) + PrimeFlex (Layout System).
* **Forms:** React Hook Form (Gerenciamento de formulários performático).
* **Integração:** Axios.

---

## 🚀 Funcionalidades

### 🛒 Jornada de Compra
* **Catálogo Dinâmico:** Listagem, filtros e busca de instrumentos.
* **Carrinho Persistente:** Adição/remoção de itens e resumo financeiro em tempo real.
* **Checkout Inteligente:** Integração com APIs externas para **validação automática de endereço via CEP** e **cálculo de frete** em tempo real antes da finalização.
  
### 👤 Identidade e Segurança
* **Autenticação JWT:** Login seguro e rotas protegidas (`RequireAuth`).
* **Recuperação de Acesso:** Fluxo de "Esqueci minha senha" com envio de código via e-mail.
* **Gestão de Credenciais:** Troca de senha e edição de dados cadastrais.

### 📦 Painel do Usuário
* **Meus Pedidos:** Acompanhamento de status e histórico detalhado de compras.
* **Gestão de Endereços:** CRUD completo com implementação de **Soft Delete** (endereços antigos usados em pedidos não somem, apenas são arquivados).
* **Alertas de Estoque:** Usuários podem gerenciar seus alertas. Quando um produto volta ao estoque, o sistema dispara notificações automáticas.

---

## 📁 Estrutura do Projeto

A organização de pastas favorece a escalabilidade modular:

```bash
  /src
  │-- /commons       # Tipos TypeScript compartilhados (Interfaces)
  │-- /components    # Componentes reutilizáveis e específicos (Cards, Buttons etc...)
  │-- /context       # Estado Global (Auth, Cart, Toast)
  │-- /hooks         # Lógica encapsulada (useFreight, useProduct)
  │-- /lib           # Configurações de libs de terceiros (Axios instance)
  │-- /pages         # Views principais (Home, Checkout, Profile)
  │-- /routes        # Definição de rotas e Guardas de Rota
  │-- /services      # Chamadas HTTP para a API Java
  │-- /styles        # CSS Modules e temas globais
```

---

## ⚡ Como Rodar o Projeto

### Pré-requisitos
* **Node.js** (v18+)
* **RiffHouse API** rodando localmente ou em ambiente de homologação.
* **RiffHouse AI** rodando localmente ou em ambiente de homologação.

### Passo a Passo
1. Clone o repositório

```bash
  git clone https://github.com/DarkMatter015/client-ecommerce.git
  cd client-ecommerce
```

2. Instale as dependências
   
 ```bash
  npm install
```

3. Configure as Variáveis de Ambiente Crie um arquivo .env na raiz (baseado no .env.example) apontando para sua API:

 ```bash
  ## localhost:8080
  VITE_API_URL=https://riffhouse-api.onrender.com
  ## localhost:8000
  VITE_API_CHAT_URL=https://riffhouse-chat.onrender.com
```

4. Execute em modo de desenvolvimento

```bash
  npm run dev
```

👉 **Acesse:** http://localhost:5173/

---

## 👨‍💻 Autor

<table style="border: none;">
  <tr>
    <td width="100px" align="center">
      <img src="https://github.com/DarkMatter015.png" width="100px" style="border-radius: 50%;" alt="Avatar do Lucas"/>
    </td>
    <td style="padding-left: 15px;">
      <strong>Lucas Matheus de Camargo</strong><br>
      <i>Desenvolvedor Full Stack | QA</i><br>
      <br>
      <a href="https://www.linkedin.com/in/lucas-matheus-de-camargo-49a315236/" target="_blank">
        <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white" alt="LinkedIn Badge">
      </a>
      <a href="https://github.com/DarkMatter015" target="_blank">
        <img src="https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white" alt="GitHub Badge">
      </a>
    </td>
  </tr>
</table>


---

<div align="center"> <sub>Feito com ⚛️ e React por Lucas Matheus.</sub> </div>
