# Facebook Photo Fetch

> Download all the photos you uploaded to Facebook plus photos you're tagged in with all the metadata and correct date and time.

### How to use

Clone this repo and execute `index.js` via Node.js with following flags:

* **`token`**: [**Required**] A valid Facebook API token. Grab one from [here](https://developers.facebook.com/tools/explorer) by clicking "Get Token" and then "Get User Access Token", and checking "user_photos". You need to be a developer and create an app.
* **`dest`**: destination folder to download your photos to. Default: `photos`
* **`albums`**: When set, download your photo albums. Default: `true`
* **`tagged`**: When set, download your tagged photos. Default: `false`
* **`sinceDate`**: When set, only download photos newer than date. Format: yyyy/mm/dd
* **`debug`**: Debug level output. Defaults to no debug output. Can be set one or  many of these options:
  * `api`: API Calls
  * `json`: Assembling JSON
  * `download`: Photo download
  * `exif`: Adding EXIF information to photos

**Example**

```shell
node index.js\
  --tagged=true\
  --dest=/Users/mhsen/Pictures/Facebook_Photos\
  --debug=api,json,download\
  --token=MY_FB_ACCESS_TOKEN
```

#### License

Copyright 2015 - Mohsen Azimi
