---
layout: page
title: Docker
---

You can run `synvert` command in a docker container.

```
docker pull xinminlabs/awesomecode-synvert

docker run xinminlabs/awesomecode-synvert synvert --list

docker run -v <your project path>:/app xinminlabs/awesomecode-synvert synvert --run default/check_syntax /app
```