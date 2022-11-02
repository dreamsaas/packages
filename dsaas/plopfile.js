module.exports = function (plop) {
  // create your generators here
  plop.setGenerator('package', {
    description: 'yarn workspace package',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'package name (without org)'
      }
    ], // array of inquirer prompts
    actions: [
      {
        type: 'addMany',
        destination: 'packages/{{name}}',
        base: '__generators__/package/',
        templateFiles: '__generators__/package/**/*.*'
      }
    ] // array of actions
  });
};
