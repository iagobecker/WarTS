# API - Indiqui

# Pré-requisitos

É necessário instalar uma série de ferramentas antes de atuarmos em nossa API. Não é 100% certo mas para evitar problema, instale as ferramentas de forma sequencialmente a esse tutorial, segue:

1. Bom, provavelmente você deve está usando Windows, por isso é necessário baixar o wsl, que é um subsistema linux dentro do windows, o mesmo é necessário para você usar o docker que vem a seguir. Para instalar o wsl é muito fácil, abra o powershell como ******************adminstrador****************** e digite o seguinte comando:

```jsx
wsl --install
```

1. Após isso instale o docker, basta você acessar e instalar aí:

https://docs.docker.com/desktop/install/windows-install/

1. Caso não tenha, instale nodejs 

https://nodejs.org/en

## Iniciando

Nem precisa dizer mas… clone o projeto, entre na raiz do projeto clonado e execute

```jsx
npm install
```

Após isso suba a maquina virtual do docker usando

```jsx
docker-compose up
```

**IMPORTANTE**

Para o projeto funcionar, crie um arquivo .env na raiz do seu projeto e insira o seguinte código:

```jsx
PORT=8000

#MONGODB_URL=mongodb://localhost:27017
MONGODB_USERNAME=root
#MONGODB_PASSWORD=123

MONGODB_PASSWORD=1a2b3c

MONGODB_URL=mongodb+srv://cluster0.julpcqs.mongodb.net     

JWT_SECRET_KEY=123
```

Agora basta executar

```jsx
npm start
```

E pronto, bom trabalho 🙂