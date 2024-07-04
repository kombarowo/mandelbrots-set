# Mandelbro[TS](https://en.wikipedia.org/wiki/TypeScript) set

```console
$ docker build . --tag node_boiler
$ docker run -it --detach --name mandelbrots-set -v $(pwd):/home/foo/project node_boiler
$ docker exec -it mandelbrots-set bash
$ npm install
$ npm run build
```

Node.js v22.3.0

---

№69 in [programming-challenges](https://github.com/kombarowo/programming-challenges)
