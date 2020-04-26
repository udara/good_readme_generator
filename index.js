const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");

const writeFileAsync = util.promisify(fs.writeFile);

/* Prompt user for input */
function promptUser()
{
    const questions = [
        {
            type: 'input',
            name: 'project_title',
            message: 'Project Title : ',
            validate: (title) => {
            let validation =  (title.length >= 3) ? true : 'At least 3 characters required';
            return validation;
            }
        },
        {
            type: 'input',
            message: "Project Description : ",
            name: "description"
        },
        {
            type: 'input',
            message: "Installation : ",
            name: "installation"
        },
        {
            type: 'input',
            message: "Usage :",
            name: "usage"
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
            default:'Udara Ranasinghe'
        },
        {
            type: 'input',
            message: "Tests : ",
            name: "tests"
        }, 
        {
            type: 'input',
            message: "Github username : ",
            name: "github_username",
            default:'udara'
        },
        {
            type: 'input',
            message: "Github repo name : ",
            name: "github_repo_name"
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

/* Returns a badge URL */
function generateBadge(attribute,description,color)
{
    return `https://img.shields.io/badge/${attribute}-${description}-${color}`
}


/* Generate Readme template */
function generateReadme(readme_input) {
return `# ${readme_input.project_title}

![Badge](${readme_input.licence_badge})

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
Profile Image

![Profile Picture](${readme_input.github_profile})

Github Username: ${readme_input.github_username}

Github email: ${readme_input.github_email}`
}

/* Calls github APi returns response */
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

/* Write readme.md to file system  */
async function writeReadme(readme_template)
{  
    try {
    
        await writeFileAsync("readme.md", readme_template);
        console.log('SUCCESS: Readme.md file generated');
        return true;
    
    }
    catch(error) {

        console.error('ERROR WHEN WRITING FILE: ' + error);
        return false;

    }
}


async function init()
{
    try {
        const answers = await promptUser();
        const github_info = await getGithubInfo(answers.github_username,answers.github_repo_name);
            if(github_info)
            {
                let readme_input = {}
                readme_input = answers;
                readme_input.licence_badge = generateBadge('License', answers.license,'brightgreen');
                readme_input.github_profile = github_info.data.owner.avatar_url; 
                const readme_template = generateReadme(readme_input);
                const write_response = await writeReadme(readme_template);
            }   
      } catch(err) {
        console.log(err);
      }
}

init();

