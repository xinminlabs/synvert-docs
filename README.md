# Synvert

### Install dependencies

```
bundle install
```

### Start server

```
bundle exec jekyll serve --watch
```

### Visit

open `http://localhost:4000/` on browser

### Push docker

```
docker build -t xinminlabs/synvert-docs:$(git rev-parse --short HEAD) .
docker push xinminlabs/synvert-docs:$(git rev-parse --short HEAD)
```
