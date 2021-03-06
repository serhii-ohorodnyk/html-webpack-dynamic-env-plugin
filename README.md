[![Build Status](https://travis-ci.org/serhii-ohorodnyk/html-webpack-dynamic-env-plugin.svg?branch=master)](https://travis-ci.org/serhii-ohorodnyk/html-webpack-dynamic-env-plugin)

HTML Webpack Dynamic Env Plugin
=================================
This is an extension plugin for the [webpack](http://webpack.github.io/) plugin [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) that allows configure environment variables for static html app after build step and before deployment (e.g. push to cdn or docker run)

How does it work?
-----------------
This plugin subscribes on html-webpack-plugin hooks and webpack hooks, enhances output html files with default environment variables, plus generates template files for every output html with a script file to replace environment variables.

Why do I need it?
-----------------
If you need/want to be able to configure your environment variables __after__ app bundle and you don't want/can't setup heavy server side.

Installation
------------
```sh
npm i -D html-webpack-dynamic-env-plugin
```

Basic Usage
------------
Require the plugin in your webpack config:
```javascript
var HtmlWebpackDynamicEnvPlugin = require('html-webpack-dynamic-env-plugin');
```
Add the plugin to your webpack config (__remember to add it after html-webpack-plugin__):
```javascript
plugins: [
  new HtmlWebpackPlugin(),
  new HtmlWebpackDynamicEnvPlugin({
    envVars: {
      YOUR_ENV_VARIABLE: "default-value-here",
      ANOTHER_ENV_VAR: process.env.SET_DEFAULT_VALUE_FROM_BUILD_ENV || ''
    }
  })
]  
```
This will generate index.html file from HtmlWebpackPlugin with injected script tag that defines your environment defaults. It should look something like this:
```javascript
window.CLIENT_ENV = { YOUR_ENV_VARIABLE: "default-value-here", ANOTHER_ENV_VAR: "" }
```
Plus you'll have your _config-env.sh_ and _index.html.template_ files generated that you can use to configure your environment again, like this:
```sh
YOUR_ENV_VARIABLE=newvalue ./config-env.sh index.html.template index.html
```

Configuration
-------------
List of available configuration options:

|Name|Type|Default|Description|
|:--:|:----:|:--:|:----------|
|**`envVars`**|`{ [key: string]: string \| undefined }`|``|Key-value map of environment variables. Values will be used as defaults in generated html output file|
|**`windowKeyName`**|`string`|`'CLIENT_ENV'`|Property name to be used on window object to store environment variables|
|**`injectEnvVars`**|`(string, string, string) => string`|`headAppend`|Function that injects environment variables into html and template files. takes _html_, _script tag with env_ and _filename_ as parameters, returns html with injected tag. By default appeands to head tag|
|**`configFileName`**|`string`|`'config-env.sh'`|File name for the generated configuration script|
|**`configFactoryFunc`**|`string \| envs => string`|`'shell'`|Configuration script factory function. Can be either pre-defined type, e.g. 'shell' or a custom function-factory of the type: takes _envVars_ type in and returns script file content as a string|
|**`templateFileNames`**|`{ [key: string]: string }`|`{}`|Key-value map, where: _key_ - file name of generated by html-webpack-plugin html file; _value_ - template file name for this html.For every not specified html filename - template with default pattern-name will be generated. I.e. { "index.html": "index.html.template" }|

Examples
--------
You can find examples in [Examples](https://github.com/serhii-ohorodnyk/html-webpack-dynamic-env-plugin/tree/master/examples) folder.