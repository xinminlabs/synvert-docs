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

### Production deplooyment

```
docker build -f Dockerfile.prod -t xinminlabs/synvert-docs:$(git rev-parse --short HEAD) .
docker push xinminlabs/synvert-docs:$(git rev-parse --short HEAD)


docker service create --name synvert-docs --publish mode=host,target=80,published=10090 xinminlabs/synvert-docs:$(git rev-parse --short HEAD)

docker service update --image xinminlabs/synvert-docs:$(git rev-parse --short HEAD) synvert-docs
```
