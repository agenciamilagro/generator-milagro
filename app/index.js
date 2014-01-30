'use strict';
var util = require('util');
var path = require('path');
var spaw = require('child_process').spaw;
var chalk = require('chalk');
var globule = require('globule');
var shelljs = require('shelljs');
var yeoman = require('yeoman-generator');
var bundle = false;
var errr = chalk.bold.red;


var MilagroGenerator = module.exports = function MilagroGenerator(args, options, config) {

  var dependenciesInstalled = ['bundle', 'ruby'].every(function (depend) {
    return shelljs.which(depend);
  });

  if (!dependenciesInstalled) {
    console.log(errr('Erro!') + ' Certifique-se de ter instalado: ' + chalk.white('Ruby') + ' e ' +chalk.white('Bundler (gem)') + '.');
    shelljs.exit(1);
  }

  // yeoman.generators.Base.apply(this, arguments);

  // this.on('end', function () {
  //   this.installDependencies({ skipInstall: options['skip-install'] });
  // });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(MilagroGenerator, yeoman.generators.Base);

MilagroGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    type: 'confirm',
    name: 'someOption',
    message: 'Would you like to enable this option?',
    default: true
  }];

  this.prompt(prompts, function (props) {
    this.someOption = props.someOption;

    cb();
  }.bind(this));
};

MilagroGenerator.prototype.app = function app() {
  this.mkdir('app');
  this.mkdir('app/templates');

  this.copy('_package.json', 'package.json');
  this.copy('_bower.json', 'bower.json');
};

MilagroGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};
