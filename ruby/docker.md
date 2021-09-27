---
layout: ruby
title: Docker
---

You can run `synvert-ruby` command in a docker container.

```
docker pull xinminlabs/awesomecode-synvert-ruby

docker run xinminlabs/awesomecode-synvert-ruby synvert-ruby --list

docker run -v <your project path>:/app xinminlabs/awesomecode-synvert-ruby synvert-ruby --run default/check_syntax /app
```