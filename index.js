const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser()
{
    const questions = [
        {
            type: 'input',
            name: 'project_title',
            message: 'Project Title : ',
            default:'Code Quiz',
            validate: (title) => {
            let validation =  (title.length >= 3) ? true : 'At least 3 characters required';
            return validation;
            }
        },
        {
            type: 'input',
            message: "Project Description : ",
            name: "description",
            default:'Timed code quiz with multiple-choice questions'
        },
        {
            type: 'input',
            message: "Installation : ",
            name: "installation",
            default:'```node app.js```',
        },
        {
            type: 'input',
            message: "Usage :",
            name: "usage",
            default:'Require Node',
        },
        {
            type: 'list',
            message: "License (Default GNU):",
            name: "license",
            choices: ['MIT', 'GNU', 'Apache', 'BSD', 'Small', 'Micro'],
            default: (licence) => {
                return 'GNU';
            }
        },
        {
            type: 'input',
            message: "Contributing : ",
            name: "contributing",
            default:'Udara Ranasinghe',
        },
        {
            type: 'input',
            message: "Tests : ",
            name: "tests",
            default:'node test',
        }, 
        {
            type: 'input',
            message: "Github username : ",
            name: "github_username",
            default:'udara',
        },
        {
            type: 'input',
            message: "Github repo name : ",
            name: "github_repo_name",
            default:'code_quiz',
        },  
        {
            type: 'input',
            message: "Github email : ",
            name: "github_email",
            validate: function(email) {
                var pass = email.match(
                 	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
                if (pass) {
                  return true;
                }
          
                return 'Please enter a valid email address';
            }
        }, 
    ]; 
    return inquirer.prompt(questions);
}

function instalationBadge(attribute,description,color)
{
    return `https://img.shields.io/badge/${attribute}-${description}-${color}`
}