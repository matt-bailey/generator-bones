'use strict';
var util = require('util');
var path = require('path');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');

var MagentoGenerator = module.exports = function MagentoGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  // setup the test-framework property, Gruntfile template will need this
  // this.testFramework = options['test-framework'] || 'mocha';

  // for hooks to resolve on mocha by default
  // if (!options['test-framework']) {
  //   options['test-framework'] = 'mocha';
  // }

  // resolved to mocha by default
  // this.hookFor('test-framework', { as: 'app' });

  this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
  this.mainCoffeeFile = 'console.log "Hello from CoffeeScript!"';

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(MagentoGenerator, yeoman.generators.Base);

MagentoGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);
  console.log('This generator scaffolds out basic Magento skin assets. \n\nLocate your Yeoman project outside of your shop root and symlink in the required assets from the `build` folder.\n');

  var prompts = [{
    name: 'interfaceName',
    message: 'What is the `interface` name for your Magento theme (i.e. /skin/frontend/[interface-name]/)?'
  },
  {
    name: 'themeName',
    message: 'What is the `theme` name for your Magento theme (i.e. /skin/frontend/[interface-name]/[theme-name]/)?'
  }];

  this.prompt(prompts, function (props) {
    // `props` is an object passed in containing the response values, named in
    // accordance with the `name` property from your prompt object. So, for us:
    this.interfaceName = props.interfaceName;
    this.themeName = props.themeName;

    cb();
  }.bind(this));
};

MagentoGenerator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js');
};

MagentoGenerator.prototype.packageJSON = function packageJSON() {
  this.template('_package.json', 'package.json');
};

MagentoGenerator.prototype.git = function git() {
  this.copy('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

MagentoGenerator.prototype.bower = function bower() {
  this.copy('bowerrc', '.bowerrc');
  this.copy('_bower.json', 'bower.json');
};

MagentoGenerator.prototype.jshint = function jshint() {
  this.copy('jshintrc', '.jshintrc');
};

MagentoGenerator.prototype.editorConfig = function editorConfig() {
  this.copy('editorconfig', '.editorconfig');
};

MagentoGenerator.prototype.mainStylesheet = function mainStylesheet() {
  this.copy('styles.scss', 'src/css/styles.scss');
};

// Not used yet
MagentoGenerator.prototype.writeIndex = function writeIndex() {};

MagentoGenerator.prototype.requirejs = function requirejs() {
  this.indexFile = this.appendScripts(this.indexFile, 'js/main.js', ['bower_components/requirejs/require.js'], {
    'data-main': 'js/main'
  });

  // Add a basic AMD module
  this.write('src/js/app.js', [
    '/*global define */',
    'define([], function () {',
    '    \'use strict\';\n',
    '    return \'Hello!\';',
    '});'
  ].join('\n'));

  this.template('require_main.js', 'src/js/main.js');
};

MagentoGenerator.prototype.src = function src() {
  this.mkdir('src');
  this.mkdir('src/images');
  this.mkdir('src/images/svg-src');
  this.mkdir('src/js');
  this.mkdir('src/css');
  this.mkdir('src/css/modules');
  this.mkdir('src/css/partials');
  this.mkdir('src/templates');
  this.mkdir('src/templates/layouts');
  this.mkdir('src/templates/pages');
  this.mkdir('src/templates/partials');
  this.copy('favicon.ico', 'src/favicon.ico');
  this.write('src/index.html', this.indexFile);
  this.write('src/js/hello.coffee', this.mainCoffeeFile);
};
