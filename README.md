# Lelylan Gateway

Gateway to access different **nodes** connecting the physical world to
Lelylan [Lelylan](http://dev.lelylan.com). A node represents the way
a physical device (or a family of devices) are connected to the web.

- [X] [Lelylan MQTT](nodes.lelylan.com/mqtt)
- [ ] [Electric Imp](nodes.lelylan.com/electricimp)
- [ ] [lockitron](nodes.lelylan.com/lockitron)

In other words Lelylan Nodes aims to connect the largest number of new
and existing devices to the Lelylan platform in an open and collaborative
way.


## Requirements

Lelylan Nodes is tested against Node 0.8.8.


## Installation

Clone the repository.

    git clone git@github.com:lelylan/nodes.git

Run Node server.

    foreman start


## Getting Started

* Run `foreman start`
* Open the [server](http://localhost:8004)


## Deploy

Follow [getting started with jitsu](https://www.nodejitsu.com/getting-started/).


## Resources

* [Ascoltatori](https://github.com/mcollina/ascoltatori)
* [Physical API](http://dev.lelylan.com/api/physicals)


## Contributing

Fork the repo on github and send a pull requests with topic branches.
Do not forget to provide specs to your contribution.

### Running specs

* Fork and clone the repository
* Run `npm install`
* Run `npm test`


## Coding guidelines

Follow [github](https://github.com/styleguide/) guidelines.


## Feedback

Use the [issue tracker](http://github.com/lelylan/nodes/issues) for bugs.
[Mail](mailto:touch@lelylan.com) or [Tweet](http://twitter.com/lelylan) us for any idea that can improve the project.


## Links

* [GIT Repository](http://github.com/lelylan/nodes)
* [Ascoltatori](https://github.com/mcollina/ascoltatori)
* [Physical API](http://dev.lelylan.com/api/physicals)
* [Lelylan Dev Center](http://dev.lelylan.com)
* [Lelylan Site](http://lelylan.com)


## Authors

[Andrea Reginato](http://twitter.com/andreareginato)


## Contributors

Special thanks to the [following people](https://github.com/lelylan/nodes/contributors) for submitting patches.


## Changelog

See [CHANGELOG](nodes/blob/master/CHANGELOG.md)


## Copyright

Copyright (c) 2013 [Lelylan](http://lelylan.com).
See [LICENSE](nodes/blob/master/LICENSE.md) for details.
