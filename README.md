# Nodejs Friends

Sistema de adicionar amigos, com autenticação e adiministrador.
---------------------------------------------------------------

## Como utilizar o código?

- Para utilizar-lo deverá ter o node instalado em sua máquina.
- Após baixar todos os arquivos executar o seguinte comando: **`npm i`.**
- Dentro da pasta database existe um arquivo chamado database, nele mudar os campos que estão entre parenteses para o seu ambiente

> **Note:** Execute também o comando `npm install --save nodemon`

- Após seguir todos esses procedimentos, deverá iniciar o projeto digitando no terminal da pasta **`npm start`**
- Depois basta escrever: **`http://localhost:1616/`** e utilizar ou realizar testes.

# Transformando um usuário comum em admin
- Claro deve antes entrar no banco de dados que colocou dentro do arquivo database.
```
UPDATE (nome da tabela) SET admin = true WHERE id = (id da pessoa desejado)
``` 
- Após fazer essa alteração, logar novamente e na barra de pesquisa escrever: `http://localhost:1616/admin`

-----------------------------------------------------------------------------------------------------------------------------------------

## Explicação dos comandos a cima

- Sobre o `npm i`, ele irá instalar todas as dependências necessárias para o projeto rodar.
- Sobre o `npm install --save nodemon`, ele irá instalar uma dependência que ao visualizar no arquivo 
package.json estará escrito `"start": "nodemon index.js"`, onde ele é responsável por rodar o programa.
- E sobre o `npm start` irá execultar o nodemon index.js por baixo dos panos, onde o responsável é o **start** 
do tópico a cima.

-----------------------------------------------------------------------------------------------------------------------------------------
O site em si apenas utilizei html e javascript no back end a fim de demostrar meus conhecimentos com essa tecnologia. 
