# Lelylan Gateway

Gateway to access different **nodes** connecting the physical world to
[Lelylan](http://dev.lelylan.com). Covered ones are:

- [x] MQTT

In other words Lelylan Nodes aims to connect the largest number of devices
to the Lelylan platform in an open and collaborative way by making any
device interoperate to each other.


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

* Run `git push heroku master`


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

Follow [felix](http://nodeguide.com/style.html) guidelines.


## Feedback

Use the [issue tracker](http://github.com/lelylan/nodes/issues) for bugs.
[Mail](mailto:touch@lelylan.com) or [Tweet](http://twitter.com/lelylan) us for any idea that
can improve the project.


## Links

* [GIT Repository](http://github.com/lelylan/nodes)
* [Ascoltatori](https://github.com/mcollina/ascoltatori)
* [Physical API](http://dev.lelylan.com/api/physicals)
* [MQTT](http://dev.lelylan.com/api/physicals/mqtt)
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
