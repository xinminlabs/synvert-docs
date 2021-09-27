---
layout: javascript
title: Docker
---

You can run `synvert-javascript` command in a docker container.

```
docker pull xinminlabs/awesomecode-synvert-javascript

docker run xinminlabs/awesomecode-synvert-javascript synvert-javascript --list

docker run -v <your project path>:/app xinminlabs/awesomecode-synvert-javascript synvert-javascript --run javascript/trailing-comma /app
```