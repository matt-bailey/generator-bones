'use strict';
var util = require('util');
var path = require('path');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');

var BonesGenerator = module.exports = function BonesGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  // setup the test-framework property, Gruntfile template will need this
  //this.testFramework = 'mocha';
  // resolved to mocha by default
  //this.hookFor('mocha', { as: 'app' });

  // this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(BonesGenerator, yeoman.generators.Base);

BonesGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);
  console.log('This generator scaffolds out a basic web project. \n\nIt\'s based on generator-webapp, but simplified and with some other useful stuff added in - Grunticon for all your SVG needs, and Assemble for building static HTML files from modular templates and data.');

  var prompts = [{
    name: 'projectName',
    message: 'Give your project a name:'
  }];

  this.prompt(prompts, function (props) {
    this.projectName = props.projectName;

    cb();
  }.bind(this));
};

BonesGenerator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js');
};

BonesGenerator.prototype.packageJSON = function packageJSON() {
  this.template('_package.json', 'package.json');
};

BonesGenerator.prototype.git = function git() {
  this.copy('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

BonesGenerator.prototype.bower = function bower() {
  this.copy('bowerrc', '.bowerrc');
  this.copy('_bower.json', 'bower.json');
};

BonesGenerator.prototype.jshint = function jshint() {
  this.copy('jshintrc', '.jshintrc');
};

BonesGenerator.prototype.editorConfig = function editorConfig() {
  this.copy('editorconfig', '.editorconfig');
};

// BonesGenerator.prototype.writeIndex = function writeIndex() {};

BonesGenerator.prototype.scaffolding = function scaffolding() {
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

  this.copy('_!-edit-template-files-not-html', 'src/_!-edit-template-files-not-html');

  this.copy('default.hbs', 'src/templates/layouts/default.hbs');
  this.copy('header.hbs', 'src/templates/partials/header.hbs');
  this.copy('index.hbs', 'src/templates/pages/index.hbs');
  this.copy('patterns.hbs', 'src/templates/pages/patterns.hbs');

  this.copy('styles.scss', 'src/css/styles.scss');

  this.copy('main.js', 'src/js/main.js');
  this.copy('plugins.js', 'src/js/plugins.js');

  this.copy('test.svg', 'src/images/svg-src/test.svg');
  this.copy('favicon.ico', 'src/favicon.ico');

  // this.write('src/index.html', this.indexFile);
};
