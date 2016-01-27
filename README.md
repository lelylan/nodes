# Lelylan Nodes

Enable a two way communication between the cloud and the physical world. Lelylan Nodes want to integrate the largest number of connected devices to a unique platform, making them all accessible through a unique API. A very nice work in this direction is [thethingsystem.com](http://thethingsystem.com/).

#### Supported Nodes

- [x] MQTT


#### Programmed Nodes

- [ ] Nest
- [ ] Lifx

Help us on adding [new nodes](http://thethingsystem.com/dev/supported-things.html).


## Requirements

Lelylan Nodes is tested against Node 0.8.8.


## Installation

    $ mongod
    $ git clone git@github.com:lelylan/mqtt.git
    $ npm install && npm install -g foreman
    $ nf start


## Resources

* [Lelylan Dev Center](http://dev.lelylan.com)
* [Mosca](https://github.com/mcollina/mosca)
* [Ascoltatori](https://github.com/mcollina/ascoltatori)


## Contributing

Fork the repo on github and send a pull requests with topic branches.
Do not forget to provide specs to your contribution.


### Running specs

* Fork and clone the repository
* Run `npm install`
* Run `npm test`


## Coding guidelines

Follow [Felix](http://nodeguide.com/style.html) guidelines.


## Feedback

Use the [issue tracker](http://github.com/lelylan/nodes/issues) for bugs or [stack overflow](http://stackoverflow.com/questions/tagged/lelylan) for questions.
[Mail](mailto:dev@lelylan.com) or [Tweet](http://twitter.com/lelylan) us for any idea that can improve the project.


## Links

* [GIT Repository](http://github.com/lelylan/nodes)
* [Lelylan Dev Center](http://dev.lelylan.com)
* [Lelylan Site](http://lelylan.com)


## Authors

[Andrea Reginato](https://www.linkedin.com/in/andreareginato)


## Contributors

Special thanks to all [contributors](https://github.com/lelylan/nodes/contributors)
for submitting patches.


## Changelog

See [CHANGELOG](https://github.com/lelylan/nodes/blob/master/CHANGELOG.md)


## License

Lelylan is licensed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).
