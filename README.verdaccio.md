### setup ***verdaccio***

```sh
verdaccio
```

### config local account
```sh
npm addUser --registry http://localhost:4873/
```

### publish local package
```sh
npm publish --registry http://localhost:4873/
```

### install local package
```sh
npm install package_name --registry http://localhost:4873/
```
```sh
npm add package_name --registry http://localhost:4873/
```