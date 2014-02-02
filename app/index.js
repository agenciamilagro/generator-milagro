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

  yeoman.generators.Base.apply(this, arguments);

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
  this.appname = path.basename(process.cwd());
  this.gitInfo = {
    name: this.user.git.username,
    email: this.user.git.email,
  };

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });

    if (bundle === false) {
      console.log(errr('Erro! Bundle install failed! ') + 'Execute manualmente o comando, \'gem install bundle\'');
    }
  });
};

util.inherits(MilagroGenerator, yeoman.generators.Base);

// Questions!
MilagroGenerator.prototype.askForProject = function askForProject() {
  var cb = this.async();
  var prompts = [{
    name: 'project',
    message: 'Nome do projeto: '
  },
  {
    name: 'client',
    message: 'Nome do cliente: '
  }];

  this.prompt(prompts, function (props) {

    this.project = props.project;
    this.client = props.client;

    cb();
  }.bind(this));
};

MilagroGenerator.prototype.askForTools = function askForTools() {
  var cb = this.async();
  var prompts = [{
    name: 'cssPre',
    type: 'list',
    message: 'Pré-processadores CSS?',
    choices: ['Compass', 'Sass', 'None']
  },
  {
    name: 'cssFramework',
    type: 'list',
    message: 'CSS Framework?',
    choices: ['Foundation', 'Bootstrap', 'None']
  },
  {
    name: 'autoPre',
    type: 'confirm',
    message: 'CSS Autoprefixer?'
  },
  {
    name: 'jqVersion',
    type: 'list',
    message: 'Versão do jQuery',
    choices: ['1.8.3', '1.11.0', '2.1.0']
  }];

  console.log(chalk.blue('\nFerramentas/Frameworks/Libraries e pré-processadores: '));

  this.prompt(prompts, function (props) {

    this.cssPre = props.cssPre === 'None' ? false : props.cssPre.toLowerCase();
    this.cssFramework = props.cssFramework === 'None' ? props.cssFramework.toLowerCase();
    this.autoPre = props.autoPre;
    this.jqVersion = props.jqVersion;

    cb();
  }.bind(this));
}

MilagroGenerator.prototype.askForDirs = function askForDirs() {
  var cb = this.async();
  var cssPre = this.cssPre;
  var slashFilter = function (input) {
    return input.replace(/^\/*|\/*$/g, '');
  };

  var prompts = [{
    name: 'cssDir',
    message: 'Diretório CSS',
    default: 'css',
    filter: slashFilter
  },
  {
    name: 'sassDir',
    message: 'Diretório Sass',
    default: 'sass',
    filter: slashFilter
  },
  {
    name: 'jsDir',
    message: 'Diretório js',
    default: 'js',
    filter: slashFilter
  },
  {
    name: 'imgDir',
    message: 'Diretório imagens',
    default: 'img',
    filter: slashFilter
  },
  {
    name: 'fontsDir',
    message: 'Diretório fontes',
    default: 'fonts',
    filter: slashFilter
  }];

  this.prompt(prompts, function (props) {

    this.cssDir = props.cssDir;
    this.sassDir = props.sassDir;
    this.jsDir = props.jsDir;
    this.imgDir = props.imgDir;
    this.fontsDir = props.fontsDir;

    this.cssExDir = props.cssDir.split('/').pop();
    this.sassExDir = props.sassDir.split('/').pop();
    this.jsExDir = props.jsDir.split('/').pop();
    this.imgExDir = props.imgDir.split('/').pop();
    this.fontsExDir = props.fontsDir.split('/').pop();

    cb();
  }.bind(this));
}

// Templates
MilagroGenerator.prototype.git = function git() {
  this.template('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

MilagroGenerator.prototype.gruntfile = function grunfile() {
  this.template('Gruntfile.js');
};

MilagroGenerator.prototype.packageJSON = function packageJSON() {
  this.template('_package.json', 'package.json');
};

MilagroGenerator.prototype.bower = function bower() {
  this.copy('bowerrc', '.bowerrc');
  this.template('_bower.json', 'bower.json');
};

MilagroGenerator.prototype.editor = function editor() {
  this.copy('editorconfig', '.editorconfig');
};

MilagroGenerator.prototype.gemfile = function gemfile() {
  this.template('Gemfile');
};

MilagroGenerator.prototype.rubyDependencies = function () {
  var execComplete;

  console.log('\nExecutando ' + chalk.green.bold('bundle install') + ' para instalar as Ruby Gems');

  this.conflicter.resolve(function (err) {
    if (err) {
      return this.emit('error', err);
    }

    execComplete = shelljs.exec('bundle install');

    if (execComplete.code === 0) {
      bundle = true;
    }
  });
};

MilagroGenerator.prototype.templates = function templates() {
  var date = new Date();
  var formattedDate = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear();

  this.mkdir(path.join('app', this.cssDir));
  this.mkdir(path.join('app', this.sassDir));
  this.mkdir(path.join('app', this.jsDir));
  this.mkdir(path.join('app', this.imgDir));
  this.mkdir(path.join('app', this.fontsDir));
};
