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

function generateReadme(readme_input) {
    return `# ${readme_input.project_title}
    
    ![](${readme_input.licence_badge})
    
    ${readme_input.description}
       
    ### Table of Contents
    1. Installation
    2. Usage
    3. License
    4. Contributing
    5. Tests
    6. Questions
           
    ### Installation 
    ${readme_input.installation}
          
    ### Usage
    ${readme_input.usage}
    
    ### License
    ${readme_input.license}
    
    ### Contributing
    ${readme_input.contributing}
    
    ### Tests
    ${readme_input.tests}
    
    ### Questions
    ${readme_input.github_username}
    ${readme_input.github_email}
    ${readme_input.github_profile}`;
    }

async function getGithubInfo(github_username,github_repo_name)
{
    try 
    {
        const queryUrl = `https://api.github.com/repos/${github_username}/${github_repo_name}`;
        const api_response =  await axios.get(queryUrl);
        return api_response;
    }
    catch(e)
    {
        console.error('API ERROR: ' + e);
    }
}