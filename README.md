# E-Commerce API

API RESTful para gestão de um sistema de e-commerce, desenvolvida em Java com Spring Boot.

## Sobre o projeto

Este projeto simula as operações básicas de um e-commerce, com foco em cadastro e gerenciamento de categorias, produtos, pedidos e itens de pedido. A aplicação segue uma arquitetura em camadas com `Controller`, `Service`, `Repository`, `Entity`, `DTO` e tratamento global de exceções.

## Tecnologias utilizadas

- Java 21
- Spring Boot 4.1.1
- Spring Web
- Spring Data JPA
- Spring Validation
- MySQL
- Maven

## Funcionalidades

- Cadastro, listagem, atualização e remoção de categorias
- Cadastro de produtos vinculados a categorias
- Controle de preço, descrição e estoque
- Gestão de pedidos (orders)
- Gestão de itens de pedido (order items)
- Validação de dados de entrada
- Tratamento padronizado de erros e exceções

## Estrutura do projeto

```text
src/
├── main/
│   ├── java/com/portfolio/e_commerceAPI/
│   │   ├── Controller/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── entities/
│   │   ├── dtos/
│   │   ├── Exceptions/
│   │   └── ECommerceApiApplication.java
│   └── resources/
│       └── application.properties
└── test/
```

## Pré-requisitos

Antes de rodar a aplicação, certifique-se de ter instalado:

- Java 21
- Maven
- MySQL em execução localmente na porta 3306

## Como executar localmente

1. Clone o repositório:

```bash
git clone https://github.com/PettersonnOliveira/e-commerce-api.git
cd e-commerce-api
```

2. Configure a conexão com o banco MySQL. O projeto usa a propriedade `spring.datasource.password`, então você pode definir uma variável de ambiente ou editar o arquivo `src/main/resources/application.properties`.

Exemplo:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/e-commerce_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=${MINHA_SENHA}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Ou, em terminal no Windows PowerShell:

```powershell
$env:MINHA_SENHA="sua_senha"
```

3. Execute a aplicação com o Maven:

```bash
./mvnw spring-boot:run
```

4. A aplicação ficará disponível em:

```text
http://localhost:8080
```

O Hibernate criará automaticamente o banco `e-commerce_db` e as tabelas necessárias.

## Endpoints principais

### Categorias

- `POST /categories` - cria uma categoria
- `GET /categories` - lista todas as categorias
- `GET /categories/{id}` - busca uma categoria por id
- `PUT /categories/{id}` - atualiza uma categoria
- `DELETE /categories/{id}` - remove uma categoria

Exemplo de criação:

```http
POST /categories
Content-Type: application/json

{
  "name": "Eletrônicos"
}
```

### Produtos

- `POST /products` - cria um produto
- `GET /products` - lista todos os produtos
- `GET /products/{id}` - busca um produto por id
- `PUT /products/{id}` - atualiza um produto
- `DELETE /products/{id}` - remove um produto

Exemplo de criação:

```http
POST /products
Content-Type: application/json

{
  "name": "Smartphone X",
  "description": "Telefone com 128GB e câmera de 48MP",
  "price": 2499.99,
  "stock": 20,
  "categoryId": 1
}
```

### Pedidos

- `POST /orders`
- `GET /orders`
- `GET /orders/{id}`
- `PUT /orders/{id}`
- `DELETE /orders/{id}`

### Itens de pedido

- `POST /order-items`
- `GET /order-items`
- `GET /order-items/{id}`
- `PUT /order-items/{id}`
- `DELETE /order-items/{id}`

## Tratamento de erros

A aplicação utiliza exceções personalizadas para padronizar respostas em cenários de erro, como:

- recurso não encontrado
- regra de negócio inválida
- dados inválidos enviados na requisição

## Melhorias futuras

- autenticação e autorização
- paginação e filtros em listagens
- documentação interativa com Swagger/OpenAPI
- testes automatizados de integração
- camada de cache e melhoria de performance

## Licença

Este projeto está sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.
