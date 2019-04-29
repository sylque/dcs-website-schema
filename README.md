# dcs-website-schema

In [Docuss](https://github.com/sylque/docuss), you use JSON website description
files to describe your website, so that Docuss knows how to connect it to the
Discourse plugin.

## Always validate your JSON file before use

Use the
**[Docuss Validation Tool](https://sylque.github.io/dcs-website-schema/public/validate.html)**.

Or use any other JSON validator, with
[this schema](https://sylque.github.io/dcs-website-schema/json/schema.json).

Failing to validate your file might break your website in many subtle ways.

## Minimum file

This file describes a website with a single home page named `index.html`, with
no interaction with Discourse (unless you add a "Forum" menu pointing to
`http://www.mydiscourse.org/latest`, as explained
[here](https://github.com/sylque/dcs-discourse-plugin2#website-navigation)).

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

## Minimum file with discussions

This file describes a website with a single home page named `index.html`, with
attached discussions.

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
