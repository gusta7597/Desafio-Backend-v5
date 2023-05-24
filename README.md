<html>
<head>
</head>
<body>
<h1 align="center">Desafio Backend</h1>

# Instruções para uso
Antes de começar a utilizar a aplicação, é necessário criar um banco de dados Postgre com extenção PostGis e modificar o arquivo `./src/db/dbconfig.js` com as informações para conexão com o banco de dados.

Além disso, é preciso executar o seguinte comando para instalar as dependências da aplicação:
```bash
npm install
```
Após isso é possivel rodar a aplicação com o comando
```bash
npm run dev
```
# Autentificação
Antes de usar as rotas é necessario passar pela autentificação.

## 0. POST /auth
Utilize essa rota para passar pela autentificação, o sistema de resposta deve ficar assim:
```json
{
  "email": "adm@teste.com",
  "senha":"123"
}
```
Após isso sera devolvido um token para ser utilizado, vá para seção de headers em seu PostMan ou sistema parecido e crie um header com a chave Authorization, na parte de value do mesmo adicione o token que obteve, e então pronto ja pode começar a utilizar a aplicação.

# Pontos
## 1. GET /locations
Retorna uma mensagem mostrando todos os pontos salos no banco.

### Resposta da Aplicação:
```json
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -43.9372,
                    -19.9208
                ]
            },
            "properties": {
                "id": 1,
                "name": "Localização 1"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -43.9372,
                    -19.9208
                ]
            },
            "properties": {
                "id": 2,
                "name": "Localização 1"
            }
```

## 2. GET /locations/:id
Retorna uma mensagem com o local que possui o ID passado na URL.
```json
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -43.9372,
                    -19.9208
                ]
            },
            "properties": {
                "id": 1,
                "name": "Localização 1"
            }
        }
    ]
}
```

## 3. POST /locations
Cria um novo ponto no banco, basta passar os valores Nome, Latitude e Longitude. Exemplo de requisição:
```json
{
  "name": "Localização 1",
  "longitude": -43.9372,
  "latitude": -19.9208
}
```
Retorno como resposta:
```json
{
    "message": "Criado com sucesso"
}
```
## 4. PUT /locations/:id
Modifica um ponto ja armazenado no banco, modificando apenas aquele que tem o ID igual ao passado na URL. Exemplo de Requisição:
```json
{  
    "name": "Parque da Cidade",
    "latitude": -23.221112,
    "longitude": -45.899678
}
```
Retorno como resposta:
```json
{
    "message": "Editado com sucesso"
}
```
## 5. DELETE /locations/:id
Exclue um ponto do banco de dados criado a partir do ID passado na URL.
Exemplo de Resposta:
```json
{
    "message": "removido com sucesso"
}
```

## 6. GET /locations/:id1/distanceto/:id2
Verifica a Distancia de um ponto ao outro a partir das IDs passadas na URL. Exemplo de Resposta:
```json
{
    "distancia": 1200
}
```
## 7. GET /locations/:id1/isInArea/:id2
Verifica se um ponto esta dentro de uma area a partir das IDs passadas na URL. Exemplo de Resposta:
```json
{
    "estaDentro": false
}
```

## 8. GET /locations/allInArea/:id
Retorna a quantia de Pontos dentro de uma Area, a partir do ID da area:
```json
{
    "todosDentro": false
}
```
## 1. GET /areas
Retorna uma mensagem mostrando todas as areas salvos no banco. Exemplo de Resposta:

```json
[
    {
        "id": 2,
        "name": "Área 1",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [
                        -133,
                        122
                    ],
                    [
                        -111,
                        111
                    ],
                    [
                        -100,
                        100
                    ],
                    [
                        -99,
                        99
                    ]
                ]
            ]
        }
    },
    {
        "id": 1,
        "name": "Área 1",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [
                        -133,
                        122
                    ],
                    [
                        -111,
                        111
                    ],
                    [
                        -100,
                        100
                    ],
                    [
                        -99,
                        99
                    ]
                ]
            ]
        }
    }
]
```

## 2. GET /areas/:id
Retorna uma mensagem com a area que possui o ID passado na URL.
```json
[
    {
        "id": 2,
        "name": "Área 1",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [
                        -133,
                        122
                    ],
                    [
                        -111,
                        111
                    ],
                    [
                        -100,
                        100
                    ],
                    [
                        -99,
                        99
                    ]
                ]
            ]
        }
    }
]
```

## 3. POST /areas
Cria uma nova area no banco, basta passar os valores Nome, Latitude e Longitude. Exemplo de requisição:
```json
{
  "name": "Área 1",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [11, 11],
        [12, 12],
        [13, 13],
        [11, 11]
      ]
    ]
  }
}
```
Retorno como resposta:
```json
{
    "message": "Criado com sucesso"
}
```
## 4. PUT /areas/:id
Modifica uma area já armazenada no banco, modificando apenas aquele que tem o ID igual ao passado na URL. Exemplo de Requisição:
```json
{  
{
  "name": "Área 2",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [67.99, 65],
        [22, 32],
        [23, 39],
        [42, 44]
      ]
    ]
  }
}
}
```
Retorno como resposta:
```json
{
    "message": "Editado com sucesso"
}
```
## 5. DELETE /locations/:id
Exclue uma area do banco de dados criado a partir do ID passado na URL.
Exemplo de Resposta:
```json
{
    "message": "removido com sucesso"
}
```