# Briteweb Base Project

This site is an instance of Briteweb's base project.

You can find a live working version at: [http://baseproject.wpengine.com/](http://baseproject.wpengine.com/)

## Project Structure

At the root of the project you will find all the usual wordpress file structure, plus some additional files and directories.

When beginning development make sure to edit `local-config.php` and add the correct database connection information:

    define('DB_NAME', <your database name>);
    define('DB_USER',  <your database user>);
    define('DB_PASSWORD',  <your database password>);
    define('DB_HOST', '127.0.0.1');


The theme itself will live under `wp-content/themes/base-theme`. Here's a breakdown what's inside the theme:

### templates

Custom wordpress templates created for this project. In addition to this, there will be several standard wordpress templates sitting at the root of the theme.

### src

This folder will contain the majority of assets used for in the site. One thing to note is that both `styles` and `scripts` in this directory will be compiled and placed in the `dist` directory parallel to `src`.

#### src/views

Contains most of the HTML markup for the site. Currently we are using the `twig` templating language to put together our templates. The files here will be called by the different php templates in the theme.

### lib

All of our custom developed php code lives here. These classes are included via the `functions.php` file at the root.

### dist

Destination folder for compilation. Minified and concatenated styles and scripts go here, but you shouldn't have to touch files in this folder, they should be edited in `src` and compiled.

## Working with the theme

In order for you to start developing on this theme you will need to have the following tools installed in your local machine:

- Command Line
- Composer (For installing PHP dependencies)
- [Node.js and NPM (comes with node.js)](https://nodejs.org)
- [Gulp.js](http://gulpjs.com/)

### Initial setup

1. Open the terminal and navigate to where your project folder is located in your local machine (usually `~/Sites/<project-name>`)
2. Run `npm install` from the project directory. This will install all the dependencies required for development.

With this in place you should be ready to start developing.

### Compiling styles and scripts

We are using `gulp` to run all compilation of styles and scripts.

Run `gulp watch` from the command line (from the root of your project directory).

This will initialize a localhost server and start listening for changes in your styles and script files.

## Deploying the site

In order to deploy the theme to your live sever, you may use the included deploy scripts. 

Before you can deploy from you local command line you will need to follow the steps outline in our [deployment documentation](https://bitbucket.org/briteweb/bw-dev-docs/src/master/DeploySetup.md)