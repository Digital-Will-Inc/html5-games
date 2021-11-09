#Wortal-HTML5-Game


## How to create a new game
- Just create a new folder with the name of project
- Add all you src code that will be used by the game in [ProjectName]/build
- Add the utils scripts from `Utils` in [ProjectName]/build
  - LocaleHandler.js
  - Wortal.js

## Localization

- Create a google sheet and [set it up](http://blog.pamelafox.org/2013/06/exporting-google-spreadsheet-as-json.html) & store the data in the sheets.
  - Check this [Example](https://docs.google.com/spreadsheets/d/1Hrus3NYvwjRRtNYygGNIJmj_5-cwJG9ta1iB-l6LrM8/edit?usp=sharing) of the sheet.
  - You can later create copies of the sheet so don't have to set up the sheet every time. 
- To export the localized data, which is after setting up the google sheet you can use the `Export JSON` button in google sheets(Created by script editor in Google Sheets)
- Create `i18n.js` file in `[ProjectName]/build` and add the json as js variable 
```
const i18n = //jsonCode;
```