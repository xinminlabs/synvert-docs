docker build -f Dockerfile.prod -t xinminlabs/synvert-docs:$(git rev-parse --short HEAD) .
docker push xinminlabs/synvert-docs:$(git rev-parse --short HEAD)

result=$(ssh -o StrictHostKeyChecking=no xinminlabs.com "docker service update --image xinminlabs/synvert-docs:$(git rev-parse --short HEAD) synvert-docs")
[ $? -gt 0 ] && echo 'deployment failed' && exit 1
echo $result
