[![Build Status](https://travis-ci.com/Alheimsins/frestun.svg?branch=master)](https://travis-ci.com/Alheimsins/frestun)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

# frestun

Your friendly pwa for postponing stuff.

Try it at [frestun.alheimsins.net](https://frestun.alheimsins.net).

If you want to upload your own data instead of adding one by one. Create a jsonfile and upload it.

```JavaScript
{
  "refreshRate": 10000,
  "items": [
    {
      "title": "Maccyber",
      "limits": {
        "red": 60000,
        "orange": 40000,
        "yellow": 20000
      }
    },
    {
      "title": "Zrrrzzt",
      "limits": {
        "red": 120000,
        "orange": 80000,
        "yellow": 40000
      }
    }
  ]
}
```

# Usage

If you want to deploy to [ZEIT/Now](https://zeit.co/now) configure [now.json](now.json).

# License

[MIT](LICENSE)
