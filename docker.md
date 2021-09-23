---
layout: page
title: Docker
---

You can run `synvert-ruby` command in a docker container.

```
docker pull xinminlabs/awesomecode-synvert

docker run xinminlabs/awesomecode-synvert synvert-ruby --list

docker run -v <your project path>:/app xinminlabs/awesomecode-synvert synvert-ruby --run default/check_syntax /app
```