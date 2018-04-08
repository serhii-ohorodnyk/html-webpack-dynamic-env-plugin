# customized example

There are following plugin configurations shown in this example:
- custom 'templateFileNames'
- custom 'injectEnvVars' function
- own 'windowKeyName'
- custom 'configFileName'

Following environment variables are set as default:
API_ENDPOINT, default to "https://your.api.endpoint.com"
FEATURE_FLAG, default to "true"

You can run or check results of this example in following ways:
- step into one of subfolders dist/webpack-[1-4] and run
```sh
FEATURE_FLAG=false ./cv.sh index.tmpl index.html
```
and check changed variable _FEATURE_FLAG_ in _index.html_ file
- run example with docker
```sh
docker-compose up --build
```
open http://locahost:5002, you should see content of index.html file with environment variables, and same at http://locahost:5002/second.html.