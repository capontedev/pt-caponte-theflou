<p align="center">
  <a href="https://github.com/capontedev/prueba-tecnica-mge" target="blank"><img src="https://avatars.githubusercontent.com/u/133160190?v=4" width="120" alt="caponte Logo" /></a>
</p>

## Descripción

Carlos Aponte - [Prueba Técnica Backend] - theflou.com


## Instalación 

#### `Sigue estos pasos para configurar el proyecto en tu entorno local:`

Para ejecutar este proyecto, necesitarás tener instalado Node.js (versión mínima: 20.x.x) 

1. Clonar el repositorio: 

```bash
$ git clone https://github.com/capontedev/pt-caponte-theflou
$ cd pt-caponte-theflou
```

2. Instalar dependencias: 

```bash
$ npm install
```

3. Correr o compilar el proyecto: 

```bash
# desarrollo
$ npm run start:dev

# producción
$ npm run build
$ npm run start:prod

# prueba unitarias
$ npm run test
```

## Instalación local con docker
#### `Sigue estos pasos para crear y ejecutar el proyecto docker en tu entorno local:`
```bash
$ docker build -t <NOMBRE> -f .\Dockerfile .
$ docker run -d -p 3000:3000 <NOMBRE>
```

## API Graphql
### url
```bash
http://localhost:3000/graphql
```

## Uso
### Mutation
- **Descripción**: Simula una actualización en un documento.
- **Requiere Autenticación**: No.
- **Ejemplo de solicitud**:
  ```graphql 
    mutation {
      updateDocument(documentId: 1) {
        documentId
      }
    }
  ```

### Subscription
- **Descripción**: Notifica únicamente a los usuarios conectados al documento especificado.
- **Requiere Autenticación**: Si, autenticación BASIC
  - Usuarios de prueba:
    - username: prueba1 password: 123456 o agregar en el header de la petición:
    ```json
    { "Authorization": "Basic cHJ1ZWJhMToxMjM0NTY=" }
    ```
    - username: prueba2 password: 123456 o agregar en el header de la petición:
    ```json
    { "Authorization": "Basic cHJ1ZWJhMjoxMjM0NTY=" }
    ```

- **Ejemplo de solicitud**:
  ```graphql 
    subscription {
      documentUpdates(documentId: 2) {
        documentId
      }
    }
  ```
- **Posible error**:  
  - Unauthorized
  ```json
  {
    "errors": [
      {
        "message": "Unauthorized",
        ...
      }
    ]
  }
  ```

