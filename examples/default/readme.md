# default example

This examples uses default setup of both plugins _HtmlWebpackPlugin_ and _HtmlWebpackDynamicEnvPlugin_
with following environment variables:
API_ENDPOINT, default to "https://your.api.endpoint.com"
FEATURE_FLAG, default to "true"

You can run or check results of this example in following ways:
- step into one of subfolders dist/webpack-[1-4] and run
```sh
FEATURE_FLAG=false ./config-env.sh index.html.template index.html
```
check changed variable _FEATURE_FLAG_ in _index.html_ file
- run example with docker
```sh
docker-compose up --build
```
open http://locahost:5001, you should see content of index.html file with environment variables