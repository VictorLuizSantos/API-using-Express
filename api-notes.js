/*
Instalar express pelo npm ou yarn e inicializar o jason.package
    npm install express
    npm init -y

    yarn add express
    yarn init -y

Importar módulos e criar instância do server
*/

const express = require('express')
const server = express()

// Usa isso para inserir dados (PUT) em formato json
server.use(express.json)

// Porta a ser acessada
server.listen(3000)

// No GET tem que definir a rota (route param) 
//     ou seja, o que vem logo após o localhost:porta

/*
----------------
Query parameters - /curso?aula=NodeJS res.query
Route parameters - /curso/backend res.params
Request body - { curso: 'NodeJS', tipo: 'Backend' } res.body
----------------
*/

/* 
Quando atualizamos o código, para não precisar para o servidor e startar de novo,
podemos utilizar o nodemon:

yarn add nodemon -D
nodemon index.js

Para automatizar, podemos colocar no arquivo package.json o seguinte:

...
"script": {
    "dev": nodemon.index.js
},
...

Aí, no terminal colocamos:
yarn dev

Agora, quando o arquivo é salvo, o nodemon restarta o servidor, atualizando os dados

*/

// MÉTODOS HTTP

let cursos = ['Javascript', 'Python', 'Swift']

/*
MIDDLEWARE - É uma função executada no meio das requisições
    next é para requisição seguir adiante (não travar)
*/

function checkCurso(req, res, next) {
    if (!req.body.name) {
        return res.status(400).json({error: 'Nome do curso é obrigatório'})
    }
    return next()
}

function checkIndex(req, res, next) {
    const curso = cursos[req.params.index]
    if (!curso) {
        return res.status(400).json({ message: 'Curso não existente'})
    }
    return next()
}

// GET - Read

// pegar todos os cursos
server.get('/cursos', (req, res) => {
    return res.json({ cursos: `${cursos}` })
})

server.get('/curso', (req, res) => {

    const nome = req.query.nome // isso vai ser passado pela pagina na url localhost:3000/curso?nome=Victor
    return res.json({curso: `${nome}`})
    // ou 
    // return res.send('Success') Assim ele coloca um <h1>
})

/*
Se eu quiser passar alguma varivel para acessar uma rota, por exemplo:
os dois pontos antes do 'index' diz que vai ser passado essa variavel 
*/
server.get('curso/:index', checkIndex, (req, res) => {
    const index = req.query.index
    res.json({ curso: `${index}` })
})

// Outro exemplo - localhost:3000/curso/1
server.get('/curso/:index', (req, res) => {
    const index = req.params
    res.json({ Curso: `${cursos[index]}` })
})

// POST - Create

server.post('cursos/', checkCurso, (req, res) => {
    const { name } = req.body
    cursos.push(name)

    return res.json(cursos)
})
    /*
    No postman, coloca POST, e na parte de inferior coloca JSON e escreve:
    { 'name': 'Java' }
    */

// PUT - Update

server.put('/cursos/:index', checkCurso, checkIndex, (req, res) => {
    const index = req.params
    const name = req.body
    cursos[index] = name
    return res.json(cursos)
})

// DELETE - Delete

server.delete('/cursos/:index', checkIndex, (req, res) => {
    const index = req.params
    cursos.splice(index, 1)

    return res.json({ message: 'Curso deletado com sucesso' })
})