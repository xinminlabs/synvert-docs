docker build -f Dockerfile.prod -t xinminlabs/synvert-docs:$(git rev-parse --short HEAD) .
docker push xinminlabs/synvert-docs:$(git rev-parse --short HEAD)
