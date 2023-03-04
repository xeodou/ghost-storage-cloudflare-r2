# Ghost Storage Cloudflare R2

## Installation
### Via NPM

- cd into Ghost's `current` directory and install `ghost-storage-cloudflare-r2` storage module

  ```
  cd current
  npm install ghost-storage-cloudflare-r2
  ```
- cd back to the root directory and make the storage folder if it doesn't exist yet

  ```
  mkdir content/adapters/storage
  ```
- Copy the module into the right location

  ```
  cp -vR current/node_modules/ghost-storage-cloudflare-r2 content/adapters/storage/ghost-storage-cloudflare-r2
  ```
- Install package dependencies

  ```
  cd content/adapters/storage/ghost-storage-cloudflare-r2
  npm install --production
  ```


### Via Git

In order to replace the storage module, the basic requirements are:

- Clone this repo to `/content/adapters/storage`. Please create the directories if not there.

  ```
  cd [path/to/ghost]/content/adapters/storage
  git clone https://github.com/xeodou/ghost-storage-cloudflare-r2.git
  ```
- Install dependencies

  ```
  cd ghost-storage-cloudflare-r2
  npm install --production
  ```


## Configuration

Add the following to your environment configuration, `config.development.json` if development.

```js
"storage": {
  "active": "ghost-storage-cloudflare-r2",
  "ghost-storage-cloudflare-r2": {
    "endpoint": "",
    "accessKeyId": "",
    "secretAccessKey": "",
    "assetHost": "http://localhost:2368/content/images"
  }
},

```

or you can use the environment variable as well, for instance
```
docker run -e storage__active=ghost-storage-cloudflare-r2 \
  -e storage__ghost-storage-cloudflare-r2__endpoint= \
  -e storage__ghost-storage-cloudflare-r2__accessKeyId= \
  -e storage__ghost-storage-cloudflare-r2__secretAccessKey= \
  -e storage__ghost-storage-cloudflare-r2__bucket= \
  -e storage__ghost-storage-cloudflare-r2__assetHost=http://localhost:2368/content/images \
  -p 2368:2368 -v /Users/xeodou/work/ghost-blog:/var/lib/ghost/content ghost:5.2.3-alpine
```

## License

Read [LICENSE](LICENSE)
