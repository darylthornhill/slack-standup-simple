#!/usr/bin/env node
const os = require('os');
const dir = os.homedir() + '/.slack-standup/';

require('dotenv').config({ path: dir + '.env' });

const program = require('commander');
const standup = require('../src/standupQuestions');
const setup = require('../src/setup');

program
    .version('0.0.1')
    .option('--init', 'Set things up')
    .option('-l, --list', 'list things')
    .parse(process.argv);

function checkEnv() {
    const slackUrl = process.env.SLACK_URL;
    const slackChannel = process.env.SLACK_CHANNEL;
    const slackName = process.env.SLACK_YOUR_NAME;

    return slackUrl && slackChannel && slackName;
}

if (program.init || !checkEnv()) {
    setup.init();
} else {
    standup.init();
}
