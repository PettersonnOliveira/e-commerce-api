# E-commerce API

Aplicação full stack de e-commerce desenvolvida para simular o fluxo de uma loja virtual: cadastro de usuários, autenticação, catálogo de produtos, carrinho e checkout de pedidos.

O projeto é dividido em uma API REST com Spring Boot e uma interface web em React. A API utiliza JWT para autenticação, MySQL para persistência e OpenAPI/Swagger para documentação dos endpoints.

## Funcionalidades

- Cadastro e autenticação de usuários
- Autenticação stateless com JWT
- Controle de acesso por perfil (`USER` e `ADMIN`)
- CRUD de categorias e produtos
- Consulta pública do catálogo de produtos
- Carrinho por usuário autenticado
- Adição, atualização, remoção e limpeza de itens do carrinho
- Checkout e gerenciamento de pedidos
- Validação de dados de entrada
- Tratamento global e padronizado de exceções
- Interface web para clientes e administração
- Documentação interativa com Swagger UI

## Tecnologias

### Backend

- Java 21
- Spring Boot 4.1.1
- Spring Web
- Spring Data JPA
- Spring Security
- JWT (JJWT)
- Bean Validation
- MySQL 8
- Maven
- Springdoc OpenAPI

### Frontend

- React 19
- Vite
- JavaScript
- Oxlint

### Infraestrutura

- Docker
- Docker Compose

## Estrutura do projeto

```text
.
├── src/
│   ├── main/
│   │   ├── java/com/portfolio/e_commerceAPI/
│   │   │   ├── Controller/
│   │   │   ├── config/
│   │   │   ├── dtos/
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   ├── security/
│   │   │   └── services/
│   │   └── resources/
│   │       ├── application.properties
│   │       └── data.sql
│   └── test/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── Dockerfile
├── docker-compose.yml
└── pom.xml
```

## Pré-requisitos

Para executar o projeto localmente, instale:

- Java 21
- Node.js e npm
- MySQL 8, ou Docker Desktop
- Git

## Configuração da API

As propriedades locais ficam em `src/main/resources/application.properties`. Não versione senhas, chaves JWT ou outros segredos reais.

Exemplo de configuração:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=sua_senha
spring.jpa.hibernate.ddl-auto=update

jwt.secret=uma-chave-secreta-longa-e-segura
jwt.expiration=86400000
```

As propriedades também podem ser sobrescritas por variáveis de ambiente do Spring, por exemplo:

```powershell
$env:SPRING_DATASOURCE_PASSWORD="sua_senha"
$env:JWT_SECRET="uma-chave-secreta-longa-e-segura"
```

## Executando localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/PettersonnOliveira/e-commerce-api.git
cd e-commerce-api
```

### 2. Iniciar a API

No Linux/macOS:

```bash
./mvnw spring-boot:run
```

No Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

A API ficará disponível em `http://localhost:8080`.

### 3. Iniciar o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

A interface ficará disponível em `http://localhost:5173`.

O frontend atualmente está configurado para consumir a API em `http://localhost:8080`. Para utilizar outro endereço em produção, atualize a URL da API no frontend e a origem permitida em `SecurityConfig`.

## Executando com Docker Compose

O `docker-compose.yml` sobe o MySQL e a API. Como o `Dockerfile` copia o JAR gerado pelo Maven, gere o artefato antes do build:

```bash
./mvnw clean package -DskipTests
docker compose up --build
```

No Windows:

```powershell
.\mvnw.cmd clean package -DskipTests
docker compose up --build
```

Com Docker Compose:

- API: `http://localhost:8081`
- MySQL: `localhost:3307`
- Banco dentro da rede Docker: `ecommerce_db`

Para encerrar os containers:

```bash
docker compose down
```

Para remover também os dados persistidos do MySQL:

```bash
docker compose down -v
```

## Documentação da API

Com a API em execução, acesse:

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- Especificação OpenAPI: `http://localhost:8080/v3/api-docs`

Quando a API estiver sendo executada pelo Docker Compose, substitua a porta `8080` por `8081`.

## Principais endpoints

Todas as rotas abaixo exigem o header `Authorization: Bearer <token>`, exceto quando indicado.

### Autenticação e usuários

| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| `POST` | `/users/register` | Público | Cadastra um usuário |
| `POST` | `/auth/login` | Público | Autentica e retorna um JWT |
| `GET` | `/users` | Autenticado | Lista usuários |
| `GET` | `/users/{id}` | Autenticado | Busca um usuário |
| `PUT` | `/users/{id}` | Autenticado | Atualiza um usuário |
| `DELETE` | `/users/{id}` | Autenticado | Remove um usuário |

Exemplo de login:

```json
{
  "email": "usuario@email.com",
  "password": "sua_senha"
}
```

### Catálogo

| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| `GET` | `/products` | Público | Lista produtos |
| `GET` | `/products/{id}` | Público | Busca um produto |
| `POST` | `/products` | Autenticado | Cadastra um produto |
| `PUT` | `/products/{id}` | Autenticado | Atualiza um produto |
| `DELETE` | `/products/{id}` | Autenticado | Remove um produto |
| `GET` | `/categories` | Autenticado | Lista categorias |
| `POST` | `/categories` | Autenticado | Cadastra uma categoria |
| `PUT` | `/categories/{id}` | Autenticado | Atualiza uma categoria |
| `DELETE` | `/categories/{id}` | Autenticado | Remove uma categoria |

### Carrinho

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/cart` | Consulta o carrinho do usuário autenticado |
| `POST` | `/cart/items` | Adiciona um produto ao carrinho |
| `PUT` | `/cart/items/{itemId}` | Atualiza a quantidade de um item |
| `DELETE` | `/cart/items/{itemId}` | Remove um item |
| `DELETE` | `/cart` | Limpa o carrinho |

### Pedidos

| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| `POST` | `/orders/checkout` | Autenticado | Cria um pedido a partir do carrinho |
| `GET` | `/orders` | Autenticado | Lista os pedidos do usuário; administradores visualizam todos |
| `GET` | `/orders/{id}` | Autenticado | Consulta um pedido |
| `PUT` | `/orders/{id}` | `ADMIN` | Atualiza um pedido |
| `DELETE` | `/orders/{id}` | `ADMIN` | Remove um pedido |

Também estão disponíveis os endpoints CRUD de `/order-items`.

## Testes e build

Executar os testes do backend:

```bash
./mvnw test
```

Gerar o JAR:

```bash
./mvnw clean package
```

Verificar e gerar o frontend:

```bash
cd frontend
npm run lint
npm run build
```

## Checklist para deploy

Antes de publicar a aplicação:

1. Configure uma instância MySQL de produção.
2. Defina `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME` e `SPRING_DATASOURCE_PASSWORD` como variáveis secretas.
3. Substitua `JWT_SECRET` por uma chave longa, aleatória e exclusiva.
4. Configure a URL pública da API no frontend.
5. Atualize as origens CORS permitidas em `SecurityConfig`.
6. Desative logs de debug e o DevTools em produção.
7. Execute os testes e o build antes de criar a imagem Docker.
8. Não exponha a porta do banco de dados publicamente sem necessidade.

## Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
