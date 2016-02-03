# Lelylan Nodes

Enable a two way communication between the cloud and the physical world
(a node enable the communication between Lelylan and a specific protocol/product)

#### Supported Nodes

- [x] MQTT

#### Desired Nodes

We want to connect as many existing connected products using different Lelylan Nodes. A nice project heading to this direction is [thethingsystem](http://thethingsystem.com/dev/supported-things.html).


## Requirements

Lelylan Nodes is tested against Node 0.8.8.


## Installation

    $ git clone git@github.com:lelylan/nodes.git && cd nodes
    $ npm install && npm install -g foreman
    $ nf start
    
When installing the service in production set [lelylan environment variables](https://github.com/lelylan/lelylan/blob/master/README.md#production).


## Resources

* [Lelylan Physical API](http://dev.lelylan.com/api#api-physical)


## Contributing

Fork the repo on github and send a pull requests with topic branches.
Do not forget to provide specs to your contribution.


### Running specs

        npm install
        npm test


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
