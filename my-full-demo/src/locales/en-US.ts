export default {
  common: {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add'
  },
  user: {
    register: {
      success: 'Registration successful',
      usernameExists: 'Username already exists',
      invalidUsername: 'Invalid username format',
      invalidPassword: 'Password must be at least 6 characters long'
    },
    login: {
      success: 'Login successful',
      invalidCredentials: 'Invalid username or password',
      userNotFound: 'User not found'
    },
    info: {
      success: 'Get user information successful',
      userNotFound: 'User not found'
    }
  },
  agent: {
    greeting: 'Hello! I am your intelligent assistant, how can I help you?',
    notUnderstand: 'Sorry, I don\'t quite understand your question, please try rephrasing it.',
    processing: 'Processing your request, please wait...'
  },
  skill: {
    calculator: {
      result: 'Calculation result: {{expression}} = {{result}}',
      invalidExpression: 'Invalid expression, please enter a valid mathematical expression'
    }
  }
};
