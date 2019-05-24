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

```javascript
{
  // Optional: url of the JSON schema. Helps with VSCode.
  "$schema": "https://sylque.github.io/dcs-website-schema/json/schema.json",

  // Name of your website. Valid characters: A-Z, a-z, 0-9, _. Used only for
  // css styling purpose: class dcs-website-[websiteName] is added to the
  // <html> tag when the website is displayed.
  "websiteName": "mustacchio",

  // Optional: replacement for the Discourse top left logo. Urls can be
  // absolute or relative to the JSON file location.
  "logo": {
    "logoUrl": "images/logo.jpg",
    "mobileLogoUrl": "images/logo.jpg",
    "smallLogoUrl": "images/logo.jpg"
  },

  // Docuss uses Discourse tags to associate pages/menu items/balloons to
  // Discourse topics. This section defines how Docuss creates those tags.
  //
  // The general Docuss tag format is: dcs-pageName-triggerId
  //
  // The total tag length should be less or equal to the one defined in
  // the "max tag length" Discourse setting (default is 20). In the example
  // below, we have max length = 'dcs-'.length + 6 + '-'.length + 9 = 20
  //
  // PAY ATTENTION TO WHAT YOU SET IN HERE. Once Docuss starts generating
  // tags, it will be difficult to change the tag format. If you do change
  // the format, you will need to rename all existing Discourse tags. At the
  // moment there is no batch renaming tool.
  "dcsTag": {
    // Maximum length of page names (see below)
    "maxPageNameLength": 6,

    // Maximum length of trigger ids (see below)
    "maxTriggerIdLength": 9,

    // Please set the following value to the one you can find in the "force
    // lowercase tags" Discourse setting (true by default)
    "forceLowercase": true
  },

  // List of static pages. Optional if you define dynamicPages (see below).
  // Page names should obey the dcsTag.maxPageNameLength field above.
  // Page urls can be absolute or relative to the JSON file location.
  // "needsProxy": optional, private feature.
  "staticPages": [
    { "name": "home", "url": "index.html", "needsProxy": false },
    { "name": "missio", "url": "mission.html", "needsProxy": false },
    { "name": "aboutm", "url": "about-me.html", "needsProxy": false },
    { "name": "lastev", "url": "last-event.html", "needsProxy": false },
    { "name": "whitep", "url": "white-paper.html", "needsProxy": false }
  ],

  // Web app definition. Optional if you have defined static pages (see
  // above)
  "dynamicPages": {
    // Web app url. Can be absolute or relative to the JSON file location.
    "url": "/",

    // Prefix for web app page names
    "namePrefix": "d_",

    // Page name of the initial page pointed to by the above url. Should
    // obey the above dcsTag.maxPageNameLength and namePrefix fields.
    "homePageName": "d_home",

    // Optional: private feature
    "needsProxy": false
  },

  // A redirect is a rule that tells Docuss, when it is about to transition to a 
  // certain route (called the "source" route"), to transition to another route 
  // instead (called the "destination" route"). Please see use cases here:
  // https://github.com/sylque/dcs-client/blob/master/comToPlugin.md#set-redirects
  //
  // In the "dest" object, you can use "@SAME_AS_SRC@" as a value to indicate
  // that you want the src value to be preserved.
  "redirects": [
    {
      "src": {
        "layout": 0|1|2|3,
        "pageName": "home",         // Only for layout=0|2|3
        "interactMode": "DISCUSS",  // Only for layout=2|3
        "triggerId": "info",        // Only for layout=2|3. Optional.
        "pathname": "/badges"       // Only for layout=1
      },
      "dest": {
        "layout": 0|1|2|3,
        "pageName": "missio",       // Only for layout=0|2|3
        "interactMode": "COMMENT",  // Only for layout=2|3
        "triggerId": "heading09",   // Only for layout=2|3. Optional.
        "pathname": "/top"          // Only for layout=1
      }
    }
  ],

  // This section is not used by the Docuss plugin and will be transferred
  // "as-is" at runtime to the Docuss client library used.
  "clientData": {
    // Mandatory section if you use the dcs-decorator client library
    "decorator": {
      // Optional: name of the category to be used when Docuss creates
      // topics in this website. The category must exist.
      "category": "forDocuss",

      // Optional: title of Discourse pages displayed in the right pane
      // while this website is displayed in the left pane.
      "discourseTitle": "Please comment here",

      // Optional: properties of website pages
      "pageProperties": [
        {
          // Name of pages to apply the properties to
          "pageNames": ["missio"],

          // Optional: name of the category to be used when Docuss creates
          // topics in the above pages. This overrides
          // "decorator.category". The category must exist.
          "category": "forMission",

          // Optional: title of Discourse pages displayed in the right pane
          // while the above website pages are displayed in the left pane.
          // This overrides "decorator.discourseTitle".
          "discourseTitle": "Speak your mind about this Mission"
        }
      ],

      // Optional: css rules to inject in website pages
      "injectCss": [
        {
          // Name of pages to inject css to
          "pageNames": [ "home", "missio"],

          // Css rules
          "css": ["nav, .headerlink { display: none }"]
        }
      ],

      // Optional: trigger definitions. A trigger is a menu or balloon that
      // triggers a Discourse page change when user clicks on it.
      "injectTriggers": [
        {
          // Name of pages to inject triggers to
          "pageNames": ["whitep"],

          // [Under construction]
          "ids": ["GENERATE_FROM_HTML_ID"],

          // Interaction mode: COMMENT or DISCUSS
          "interactMode": "DISCUSS",

          // Graphical user interface definition
          "ui": {
            // Css selector for the trigger. This will be the clickable
            // element, unless you set insertBalloon to true (see below)
            "cssSelector": ".article.white-paper h2, .article.white-paper h3",

            // Set to true if you want the selected trigger to be highlighted.
            // Default is false.
            "highlightable": true,

            // Set to true if you want the above highlight to be on the text
            // rather than on the div. Default is false.
            "insertTextSpan": true,

            // Set to true if you want to add a balloon after the trigger. In
            // that case the balloon becomes the clickable element. Default is
            // false.
            "insertBalloon": true,

            // Set to true if you want to display a topic counter after the
            // trigger. Default is false.
            "insertCountBadge": true,

            // Optional: add subsections.
            // A subsection if a part of the page that is linked to the trigger
            // (typically: a paragraph underneath a header). It is highlighted
            // together with its parent trigger.
            "subsection": {
              // Css selector for the starting element of subsections.
              "begin": "h2, h3",

              // Optional: sss selector for the ending element of subsections.
              // What is put in here is added to the above "begin" value.
              "end": "h1"
            }
          }

          // Optional: name of the category to be used when Docuss creates
          // topics associated with this trigger. This overrides
          // "decorator.category" and "pageProperties.category". The category
          // must exist.
          "category": "forWhitePaperBalloons",

          // Optional: title of Discourse pages displayed in the right pane
          // when the trigger has been clicked in the left pane.
          // This overrides "decorator.discourseTitle" and
          // "pagePropertiesdiscourseTitle".
          "discourseTitle": "What do you think about this paragraph?"
        }
      ]
    }
  }
}
```

## License

See [here](https://github.com/sylque/docuss#license).
