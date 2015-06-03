# Facebook Photo Fetch

> Download all the photos you uploaded to Facebook plus photos you're tagged in with all the metadata and correct data/time.

### Download the app

* Mac: ####[fb-photo-fetch.dmg](...)
* Windows ####[fb-photo-fetch.exe](...)


### Why?

Because Facebook's take out service does not include location and date information in your photos when you download them. Also, Facebook take out service does not give you photos that you're tagged in. There are some tools to automate downloading the tagged photos but they lack date and location data. Most of those tools are very spammy.

### Command Line

Clone this repo and execute `index.js` with following flags:

* **`token`**: [**Required**] A valid Facebook API token. Grab one from [here](https://developers.facebook.com/tools/explorer). You need to be a developer and create an app.
* **`dest`**: destination folder to download your photos to. Default: `photos`
* **`tagged`**: Set to `true` to download your tagged photos also. Default: `false`
* **`debug`**: Debug level output. Defaults to no debug output. Can be set one of many of these:
  * `api`: API Calls
  * `json`: Assembling JSON
  * `download`: Photo download
  * `exif`: Adding EXIF information to photos

**Example**

```shell
node cli.js \
  --tagged=true \
  --dest=/Users/mhsen/Pictures/Facebook_Photos \
  --debug=api,json,download \
  --token=MY_FB_ACCESS_TOKEN
```

#### License

Copyright 2015 - Mohsen Azimi