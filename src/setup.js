const os = require('os');
const dir = os.homedir() + '/.slack-standup/';

require('dotenv').config({ path: dir + '.env' });

const inquirer = require('inquirer');
const fs = require('fs');

const setupQs = [
    {
        type: 'input',
        name: 'SLACK_URL',
        message: 'What is your slack webhook url?'
    },
    {
        type: 'input',
        name: 'SLACK_CHANNEL',
        message: 'What channel would you like your stand up to be posted? (do not include #)'
    },
    {
        type: 'input',
        name: 'SLACK_YOUR_NAME',
        message: 'What is your slack name? (include the @)'
    }
];

function parseAnswers(answers) {
    let envString = '';
    Object.keys(answers).forEach(function(key, index) {
        envString += `${setupQs[index].name}=${answers[key]}\n`;
    });

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    fs.writeFile(dir + '/.env', envString, function(err) {
        if (err) console.log(err);
        console.log('Stored environment files.');
    });
}

module.exports = {
    init: function() {
        inquirer.prompt(setupQs).then(function(answers) {
            parseAnswers(answers);
        });
    }
};
