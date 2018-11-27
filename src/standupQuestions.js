const inquirer = require('inquirer');
const fs = require('fs');
const axios = require('axios');

const slackUrl = process.env.SLACK_URL;
const slackChannel = process.env.SLACK_CHANNEL;
const slackName = process.env.SLACK_YOUR_NAME;

const questions = [
    {
        type: 'input',
        name: 'standup.yesterday',
        message: 'Did you work on what you wanted yesterday? If not, what happened?'
    },
    {
        type: 'input',
        name: 'standup.today',
        message: 'What will you work on today?'
    },
    {
        type: 'input',
        name: 'standup.blockers',
        message: 'What obstacles or issues are impeding your progress?'
    }
];

function parseAnswers(answers) {
    var slackMessage = {
        text: `Daily stand up for ${slackName}`,
        channel: slackChannel,
        attachments: []
    };

    Object.keys(answers.standup).forEach(function(key, index) {
        slackMessage.attachments.push({
            fallback: questions[index].message,
            color: getColor(key),
            title: questions[index].message,
            text: answers.standup[key]
        });
    });

    axios
        .post(slackUrl, slackMessage)
        .then(() => {
            fs.writeFile('yesterday_standup.txt', JSON.stringify(slackMessage), function(err) {
                if (err) console.log(err);
                console.log("Successfully stored yesterday's standup.");
            });
        })
        .catch((e) => {
            console.error(
                'Please run --init again, Either your slack url is incorrect, the channel you have provided doesnt exist or your slack name is incorrect.',
                `Provided varibles slack url: ${slackUrl},`,
                `Provided varibles slack channel: ${slackChannel},`,
                `Provided varibles slack name: ${slackName}`
            );
        });
}

function getColor(key) {
    switch (key) {
        case 'yesterday':
            return '#abb8cf';
        case 'today':
            return '#2eb886';
        case 'blockers':
            return '#db6969';
    }

    return '#cccccc';
}

module.exports = {
    init: function() {
        inquirer.prompt(questions).then(function(answers) {
            parseAnswers(answers);
        });
    }
};
