// src/cli/interface.js
const { program } = require('commander');
const { handleError } = require('../utils/errorHandler');

function setupCliInterface(runAgentChain) {
  program
    .version('1.0.0')
    .description('MinChain - Minimal AI Agent Chain');

  program
    .command('analyze <text>')
    .description('Analyze the given text')
    .action(async (text) => {
      try {
        const result = await runAgentChain(text);
        if (result) {
          console.log('Analysis Result:');
          console.log(JSON.stringify(result, null, 2));
        }
      } catch (error) {
        handleError(error);
      }
    });

  program.parse(process.argv);
}

module.exports = {
  setupCliInterface,
};