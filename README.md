# GitTogether Fortaleza

Teste localmente! Aqui estão as dependências.

- Node 16
- Python 3
- [Temporal CLI](https://docs.temporal.io/cli#install)

## Iniciar cluster Temporal
```bash
temporal server start-dev
```

## app

```bash
npm i -g nodemon
npm install
nodemon index.js
```

## xx_bank
```bash
npm install
nodemon index.js
```

### python_worker
```bash
pip3 install requests
pip3 install temporalio

python3 worker.py
```

### ts_worker
```bash
npm install
npm run start
```


# Referências:
- [Temporal Samples Typescript](https://github.com/temporalio/samples-typescript)
- [Temporal Samples Python](https://github.com/temporalio/samples-python)