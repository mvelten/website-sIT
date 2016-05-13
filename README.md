# Website for studentische Informatiktage Goettingen

The live instance is shown at https://sit.informatik.uni-goettingen.de/

## Events

To add a new year it is recommended to copy the app/events/template directory to app/events/XXXX. Now add missing information within app/events/index.json and the files within app/events/XXXX.
All following paths are relative to app/events/XXXX.

### Overview

The overview description can be set within overview/de.hbs and accordingly for other languages. It uses [handlebars](http://handlebarsjs.com/) syntax; Basically plain HTML can be used.

The poster to be shown needs to be present as poster/sIT-YYYY-200.jpg (200px width) as well as sIT-YYYY-full.jpg (full size).

### Presentations

Within the presentations.json the key of an entry is considered its ID. The entries itself may hold the following attributes:

```
{
  "language": [String], // Array of language keys (e.g. "de") sorted by preference
  "title": String, // Optional; Title of the presentation
  "short": String, // Optional,HTML; Short description of the presentation (visible by default)
  "details": String, // Optional,HTML; Appended to description when "show more" is clicked
  "duration": Number, // Optional; Estimated presentation duration in minutes
  "author": String|Object, // Optional; Details of the speaker
  "company": String|Object, // Optional; Details of the company the speaker represents
  "icon": String, // Optional; font-awesome icon name to use; default: "comment"
  "color": String, // Optional; bootstrap standard type to use for icon background; default: "info"
  "page": String, // Optional; ID of custom page to refer to (see below)
  "assets": [
    "file": String, // file-name (see below)
    "icon": String // font-awesome icon name
  ],
  "translate": Object // Optional
}
```

#### Schedule

Within the schedule.json define the schedule of presentations as following:

```
{
  "YYYY/MM/DD": [
    {"time": "HH:mm", "presentation": "presentation ID"}
  ]
}
```

### Workshops

Within the workshops.json you may define workshops as following:

```
{
  "workshops": [
    {
      "language": [String], // Array of language keys (e.g. "de") sorted by preference
      "title": String, // Optional; Title of the presentation
      "short": String, // Optional,HTML; Short description of the presentation (visible by default)
      "details": String, // Optional,HTML; Appended to description when "show more" is clicked
      "author": String|Object, // Optional; Details of the speaker
      "company": String|Object, // Optional; Details of the company the speaker represents
      "page": String, // Optional; ID of custom page to refer to (see below)
      "assets": [
        "file": String, // file-name (see below)
        "icon": String // font-awesome icon name
      ],
      "times": [ // It is recommended to add an entry for each day and use multiple entries per day if the pauses are known
        {
          "datetime": "YYYY/MM/DD HH:mm", // Start time of the workshop
          "duration": Number // Optional; Estimated workshop duration in minutes
        }
      ],
      "translate": Object // Optional
    }
  ]
}
```

### Special presentation and workshop attributes

The `translate` attribute may overwrite any of the other attributes language-dependent. It needs to map the language-key to an extending object.

If the `author` is set to `null`, it will be shown as To Be Announced (TBA). If it is not set, it is not shown at all. The `author` and `company` attributes need to follow the [npm people-fields syntax](https://docs.npmjs.com/files/package.json#people-fields-author-contributors).

#### Event-specific pages and assets

A custom event-page can be defined by creating a markdown (`*.md`) or [handlebars](http://handlebarsjs.com/) (`*.hbs`) file within pages/. The filename without extension is considered the page ID which can be referenced within the events `page` attribute.
Assets (e.g. pdf files, etc.) can be stored within assets/. The filename (including extension) can be referenced within the events `assets.file` attribute. The `assets.icon` attribute is supposed to [symbolize the file-type](http://fontawesome.io/icons/#file-type).

#### Presentation Icons and colors

##### Icons

Please use an icon according to these conditions:

 * `comment` (default) if the event is a common presentation.
 * `commenting` if the event is a meta/organizational presentation or discussion.
 * `briefcase` if the event is a preperation or introduction for another event.
 * `gamepad` if the event is a fun competition.
 * `cutlery` if the event contains BBQ as main part.
 * `eye` if the event is the showcase of workshop results.
 * `user-secret` if the event is intended to be a surprise.
 * `trophy` if the event is a competition including awards.

Feel free to extend this lists if a new category is needed.

##### Colors

Please use a color according to these conditions:

 * `success`if the event is a meta discussion (e.g. greetings).
 * `info` (default) if the event has no (excessive) audience participation.
 * `primary` if the event is intended to be a surprise.
 * `warning` if the audience may participate on a voluntary basis.
 * `danger` if the whole audience is supposed to participate.

