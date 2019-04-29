# dcs-website-schema

In [Docuss](https://github.com/sylque/docuss), you use a JSON website
description file to describe your website, so that Docuss knows how to connect
it to the Discourse plugin.

## Important: validate your JSON file before use

Use the
**[Docuss Validation Tool](https://sylque.github.io/dcs-website-schema/public/validate.html)**.

Or use any other JSON validator, with
[this schema](https://sylque.github.io/dcs-website-schema/json/schema.json).

Failing to validate your file might break your website in subtle ways.

## Minimum file

This file describes a website with a single home page named `index.html`, with
no interaction with Discourse.

```
{
  "$schema": "https://sylque.github.io/dcs-website-schema/json/schema.json",

  "websiteName": "myWebsite",

  "dcsTag": {
    "maxPageNameLength": 6,
    "maxTriggerIdLength": 9,
    "forceLowercase": true
  },

  "staticPages": [
    { "name": "home", "url": "index.html" }
  ]
}
```

The above `dcsTag` section says: _When connecting a page, a menu or a balloon to
Discourse, the Discourse tag used will be of the form `dcs-pageName-triggerId`,
where pageName will be 1-6 characters long and triggerId_ (i.e. the id of the
menu or balloon) _will be 0-9 characters long. Besides, the tag will be
lowercase only._

## Single page with discussions

This file describes a website with a single home page named `index.html`, with
discussions attached to the page itself (no menu, no balloon).

```
{
  "$schema": "https://sylque.github.io/dcs-website-schema/json/schema.json",

  "websiteName": "myWebsite",

  "dcsTag": {
    "maxPageNameLength": 6,
    "maxTriggerIdLength": 9,
    "forceLowercase": true
  },

  "staticPages": [
    { "name": "home", "url": "index.html" }
  ],

  "redirects": [
    {
      "src": { "pageName": "home", "layout": "FULL_CLIENT" },
      "dest": {
        "layout": "WITH_SPLIT_BAR",
        "interactMode": "DISCUSS",
        "showRight": false
      }
    }
  ],
}
```

The above `redirects` section says: _When arriving on page "home" with layout
FULL_CLIENT_ (meaning without the Docuss split bar)_, change the layout to
WITH_SPLIT_BAR, set the interaction mode to "discuss" and don't show the right
pane._

## Other file examples

- Mustacchio - Static website:
  [dcs-website.json](https://github.com/sylque/dcs-client/blob/master/demos/mustacchio/dcs-website.json)
- Discuss The Web - Web app:
  [dcs-website.json](https://github.com/sylque/discuss-the-web/blob/master/public/dcs-website.json)

## File format reference

[Under construction]

## License

See [here](https://github.com/sylque/docuss#license).
