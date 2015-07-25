# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org).

## [Unreleased][unreleased]
### ToDo
- Add callback hook for log events

## [1.2.3] - 2015-07-25
### Changed
- Added CHANGELOG.md
- Removed changes and todo list from /index.js to CHANGELOG.md
- Updated structure to match NPM guidelines
- Updated package.json to use directories
- Moved main script functions from /oop.js to lib/base.js

### Fixed
- Variable reference in lib/base.js

## [1.2.1] - 2015-07-24
### Fixed
- Typos in README

## [1.2.0] - 2015-07-23
### Changed
- Added OOP method
  - require("tvc.logger/oop") now allows for usage of the JS "new" keyword to make multiple loggers
- Re-wrote all files

### Fixed
- MongoDB logging

[unreleased]: https://github.com/thevikingcoder/tvc.logger/tree/dev
[1.2.3]: https://github.com/thevikingcoder/tvc.logger/tree/dev
[1.2.1]: https://github.com/thevikingcoder/tvc.logger/commit/0dbacd238328403d343ee00aa992120896a8f120
[1.2.0]: https://github.com/thevikingcoder/tvc.logger