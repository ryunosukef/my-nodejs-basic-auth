# nodejs-basic-auth
## on HEROKU

---

## 前提事項

* node > v4.4.1
* npm

* git
* github.com account

* heroku.com (credit card)
* heroku toolbelt

* slack

---

## HEROKU_APP_URL

以下のURLでheroku.com上に公開することを想定し、`HEROKU_APP` の名称を決める

```
<HEROKU_APP>.heroku.com
```

環境変数に`HEROKU_APP`を設定する

```
$ export HEROKU_APP="my-nodejs-basic-auth"
```

---

## git init

user.name, user.emailを、事前に設定できていることを確認する

```
$ git config -l
```

ローカルにgitリポジトリを作成する

```
$ mkdir $HEROKU_APP
$ cd $HEROKU_APP
$ git init
$ git config -l
```

---

## npm init

npmの設定ファイル package.jsonを作成する

```
$ node -v
v4.4.1

$ npm init
name: (my-nodejs-basic-auth)
version: (1.0.0)
description:
entry point: (index.js)
test command: echo ok
git repository: (git@github.com:ryunosukef/my-nodejs-basic-auth.git)
keywords:
author:
license: (ISC)
About to write to /Users/ryunosukef/Documents/github/my-nodejs-basic-auth/package.json:

{
  "name": "my-nodejs-basic-auth",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo ok"
  },
  "repository": {
    "type": "git",
    "url": "git+ssh://git@github.com/ryunosukef/my-nodejs-basic-auth.git"
  },
  "author": "",
  "license": "ISC",
  "homepage": "https://github.com/ryunosukef/my-nodejs-basic-auth#readme"
}


Is this ok? (yes) yes
```

```
$ cat package.json
```

---

## npm install express , basic-auth-connect

```
$ npm install express --save
npm WARN package.json my-nodejs-basic-auth@1.0.0 No description
npm WARN package.json my-nodejs-basic-auth@1.0.0 No README data
express@4.13.4 node_modules/express
├── escape-html@1.0.3
├── array-flatten@1.1.1
├── cookie-signature@1.0.6
├── utils-merge@1.0.0
├── content-type@1.0.1
├── methods@1.1.2
├── etag@1.7.0
├── vary@1.0.1
├── fresh@0.3.0
├── path-to-regexp@0.1.7
├── parseurl@1.3.1
├── serve-static@1.10.2
├── range-parser@1.0.3
├── merge-descriptors@1.0.1
├── content-disposition@0.5.1
├── cookie@0.1.5
├── depd@1.1.0
├── qs@4.0.0
├── on-finished@2.3.0 (ee-first@1.1.1)
├── finalhandler@0.4.1 (unpipe@1.0.0)
├── debug@2.2.0 (ms@0.7.1)
├── proxy-addr@1.0.10 (forwarded@0.1.0, ipaddr.js@1.0.5)
├── type-is@1.6.12 (media-typer@0.3.0, mime-types@2.1.10)
├── accepts@1.2.13 (negotiator@0.5.3, mime-types@2.1.10)
└── send@0.13.1 (destroy@1.0.4, statuses@1.2.1, ms@0.7.1, mime@1.3.4, http-errors@1.3.1)
```

```
$ npm install basic-auth-connect --save
npm WARN package.json my-nodejs-basic-auth@1.0.0 No description
npm WARN package.json my-nodejs-basic-auth@1.0.0 No README data
basic-auth-connect@1.0.0 node_modules/basic-auth-connect
```

---

```
$ cat package.json
{
  "name": "my-nodejs-basic-auth",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo ok"
  },
  "repository": {
    "type": "git",
    "url": "git+ssh://git@github.com/ryunosukef/my-nodejs-basic-auth.git"
  },
  "author": "",
  "license": "ISC",
  "homepage": "https://github.com/ryunosukef/my-nodejs-basic-auth#readme",
  "dependencies": {
    "basic-auth-connect": "^1.0.0",
    "express": "^4.13.4"
  }
}
```

---

## /public/index.html

```
$ mkdir public

$ vim public/index.html
<html>
  <head>
    <title>title</title>
  </head>
  <body>
    <h1>Hello</h1>
  </body>
</html>
```

---

## /index.js

```
$ vim index.js
var express = require('express');
var app = express();
var basicAuth = require('basic-auth-connect');

var username = process.env.BASIC_AUTH_USERNAME;
var password = process.env.BASIC_AUTH_PASSWORD;

if (username && password) {
      app.use(basicAuth(username, password));
}

app.use(express.static(__dirname + '/public'));

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
      console.log("Node app is running at localhost:" + app.get('port'))
})
```

---

## node index.js

```
$ node index.js
Node app is running at localhost:5000

```

```
$ curl localhost:5000
<html>
  <head>
    <title>title</title>
  </head>
  <body>
    <h1>Hello</h1>
  </body>
</html>
```

---

## basic auth

basic認証のためのユーザ名とパスワードを環境変数に設定する

```
$ export BASIC_AUTH_USERNAME="user"
$ export BASIC_AUTH_PASSWORD="pass"
$ node index.js
Node app is running at localhost:5000

```

```
$ curl localhost:5000
Unauthorized
```

```
$ curl localhost:5000 --user $BASIC_AUTH_USERNAME:$BASIC_AUTH_PASSWORD
<html>
  <head>
    <title>title</title>
  </head>
  <body>
    <h1>Hello</h1>
  </body>
</html>
```

---

## Procfile

heroku でnodeを起動するための設定ファイル`Procfile`を作成する

```
$ vim Procfile
web: node index.js
```

---

## git add/commit

node_modules フォルダをgitの管理対象外とするように`.gitignore`を記載する

```
$ echo "node_modules" >> .gitignore
$ cat .gitignore
node_modules
```

git statusの結果、node_modulesが表示されないことを確認する

```
$ git status
On branch master

Initial commit

Untracked files:
  (use "git add <file>..." to include in what will be committed)

	.gitignore
	Procfile
	index.js
	package.json
	public/

nothing added to commit but untracked files present (use "git add" to track)
```

---

Untracked filesをadd, commitする

```
$ git add .

$ git commit -m "first commit"
[master (root-commit) 0a21244] first commit
 5 files changed, 50 insertions(+)
 create mode 100644 .gitignore
 create mode 100644 Procfile
 create mode 100644 index.js
 create mode 100644 package.json
 create mode 100644 public/index.html

$ git status
On branch master
nothing to commit, working directory clean
```

---

## heroku login

herokuにloginする

```
$ herou login
Enter your Heroku credentials.
Email: <YOUR Email>
Password (typing will be hidden):
Logged in as <YOUR Email>
```

---

## heroku apps:create

herokuにデプロイするために環境を用意する

```
$ heroku apps:create $HEROKU_APP
Creating my-nodejs-basic-auth... done, stack is cedar-14
https://my-nodejs-basic-auth.herokuapp.com/ | https://git.heroku.com/my-nodejs-basic-auth.git

$ git remote -v
heroku	https://git.heroku.com/my-nodejs-basic-auth.git (fetch)
heroku	https://git.heroku.com/my-nodejs-basic-auth.git (push)
```

---

## heroku open

ブラウザを起動して、$HEROKU_APP.herokuapp.com にアクセスする

```
$ heroku open
```

---

## git push heroku

```
$ git push herou master
Counting objects: 8, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (5/5), done.
Writing objects: 100% (8/8), 1.03 KiB | 0 bytes/s, done.
Total 8 (delta 0), reused 0 (delta 0)
remote: Compressing source files... done.
remote: Building source:
remote:
remote: -----> Node.js app detected
remote:
remote: -----> Creating runtime environment
remote:
remote:        NPM_CONFIG_LOGLEVEL=error
remote:        NPM_CONFIG_PRODUCTION=true
remote:        NODE_ENV=production
remote:        NODE_MODULES_CACHE=true
remote:
remote: -----> Installing binaries
remote:        engines.node (package.json):  unspecified
remote:        engines.npm (package.json):   unspecified (use default)
remote:
remote:        Resolving node version (latest stable) via semver.io...
remote:        Downloading and installing node 5.10.0...
remote:        Using default npm version: 3.8.3
remote:
remote: -----> Restoring cache
remote:        Skipping cache restore (new runtime signature)
remote:
remote: -----> Building dependencies
remote:        Pruning any extraneous modules
remote:        Installing node modules (package.json)
remote:        my-nodejs-basic-auth@1.0.0 /tmp/build_80773ca892b9e1989b81e5150573e8b5
remote:        ├── basic-auth-connect@1.0.0
remote:        └─┬ express@4.13.4
remote:        ├─┬ accepts@1.2.13
remote:        │ ├─┬ mime-types@2.1.10
remote:        │ │ └── mime-db@1.22.0
remote:        │ └── negotiator@0.5.3
remote:        ├── array-flatten@1.1.1
remote:        ├── content-disposition@0.5.1
remote:        ├── content-type@1.0.1
remote:        ├── cookie@0.1.5
remote:        ├── cookie-signature@1.0.6
remote:        ├─┬ debug@2.2.0
remote:        │ └── ms@0.7.1
remote:        ├── depd@1.1.0
remote:        ├── escape-html@1.0.3
remote:        ├── etag@1.7.0
remote:        ├─┬ finalhandler@0.4.1
remote:        │ └── unpipe@1.0.0
remote:        ├── fresh@0.3.0
remote:        ├── merge-descriptors@1.0.1
remote:        ├── methods@1.1.2
remote:        ├─┬ on-finished@2.3.0
remote:        │ └── ee-first@1.1.1
remote:        ├── parseurl@1.3.1
remote:        ├── path-to-regexp@0.1.7
remote:        ├─┬ proxy-addr@1.0.10
remote:        │ ├── forwarded@0.1.0
remote:        │ └── ipaddr.js@1.0.5
remote:        ├── qs@4.0.0
remote:        ├── range-parser@1.0.3
remote:        ├─┬ send@0.13.1
remote:        │ ├── destroy@1.0.4
remote:        │ ├─┬ http-errors@1.3.1
remote:        │ │ └── inherits@2.0.1
remote:        │ ├── mime@1.3.4
remote:        │ └── statuses@1.2.1
remote:        ├── serve-static@1.10.2
remote:        ├─┬ type-is@1.6.12
remote:        │ └── media-typer@0.3.0
remote:        ├── utils-merge@1.0.0
remote:        └── vary@1.0.1
remote:
remote:
remote: -----> Caching build
remote:        Clearing previous node cache
remote:        Saving 2 cacheDirectories (default):
remote:        - node_modules
remote:        - bower_components (nothing to cache)
remote:
remote: -----> Build succeeded!
remote:        ├── basic-auth-connect@1.0.0
remote:        └── express@4.13.4
remote:
remote: -----> Discovering process types
remote:        Procfile declares types -> web
remote:
remote: -----> Compressing...
remote:        Done: 12.2M
remote: -----> Launching...
remote:        Released v3
remote:        https://my-nodejs-basic-auth.herokuapp.com/ deployed to Heroku
remote:
remote: Verifying deploy... done.
To https://git.heroku.com/my-nodejs-basic-auth.git
 * [new branch]      master -> master
```

---

## heroku open

ブラウザを起動して、$HEROKU_APP.herokuapp.com にアクセスする

```
$ heroku open
```

---

## heroku config:set

heroku上にbasic認証のための環境変数を設定する

```
$ heroku config:set BASIC_AUTH_USERNAME="xxx"
$ heroku config:set BASIC_AUTH_PASSWORD="yyy"
```

---

## heroku open

ブラウザを起動して、$HEROKU_APP.herokuapp.com にアクセスする。

> BASIC認証のダイアログが表示され、環境変数に設定した値を入力し、サイトを表示できる

```
$ heroku open
```

---

## heroku slack integration

herokuの更新をslackに通知する

* slackのchannel設定メニューで`Add an app or custom integration`を選択
* <https://slack.com/apps/> の画面で検索ボックに`heroku`を入力
* <https://slack.com/apps/A0F7VRF7E-heroku> の画面で、heroku integrationを設定する
* 通知先とする`slack team`を選択
* `Add Configration`ボタンを押す
* 通知先のchannelを選択

---

## heroku addons:create deployhooks

```
$ heroku addons:create deployhooks:http --url https://hooks.slack.com/services/XXXX
Creating deployhooks-clean-97104... done, (free)
Adding deployhooks-clean-97104 to my-nodejs-basic-auth... done
Access the Deploy Hooks dashboard for this hook to finish setup.
Use `heroku addons:docs deployhooks` to view documentation.
```

## git push heroku master

`git push heroku master`して、herokuに変更内容をpushする

```
$ git commit -am "mod index.html"
$ git push heroku master
```

この後、heroku内でdeployが起動し、slackに通知されることを確認

### Thanks.
