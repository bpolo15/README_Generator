var inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");
var api = require("./api");
var generateMarkdown = require("./generateMarkdown");

const appendFileAsync = util.promisify(fs.appendFile);


inquirer
  .prompt([
    {
      type: "input",
      message: "Enter your GitHub username: ",
      name: "username"
    },
    {
      type: "input",
      message: "Enter your project title: ",
      name: "title"
    },
    {
      type: "input",
      message: "Enter a short discription about your project: ",
      name: "description"
    },
    {
      type: "list",
      message: "Choose a License:",
      choices: ["Apache License 2.0", "GNU Public License v3.0", "MIT License", "None"],
      name: "license"
    },
    {
      type: "input",
      message: "What needs to be installed? (If none, write 'none')",
      name: "installation"
    },
    {
      type: "input",
      message: "Here you can add contributors:",
      name: "contributing"
    },
    {
      type: "input",
      message: "To run test, what command should be ran?",
      name: "test"
    },
    {
      type: "input",
      message: "What is the usage/what is a sample command?",
      name: "usage"
    }
  ])
  .then(async response => {

  
   var githubResponse = await api.getUser(response.username);
   var data = githubResponse.data;
   data.installation = response.installation;
   data.license = response.license;
   data.title = response.title;
   data.github = response.username;
   data.description = response.description;
   data.contributing = response.contributing;
   data.test = response.test;
   data.usage = response.usage;


    var md = generateMarkdown(data);
    appendFileAsync(
      "README.md", md,
      function(err) {
        if (err) {
          console.log(err);
        }
      }
    );
  });
