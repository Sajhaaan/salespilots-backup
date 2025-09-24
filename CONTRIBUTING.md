# 🤝 Contributing to SalesPilots.io

We love your input! We want to make contributing to SalesPilots.io as easy and transparent as possible, whether it's:

- 🐛 Reporting a bug
- 💡 Suggesting a new feature
- 📝 Improving documentation
- 🔧 Submitting a fix
- 🌟 Adding new features

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

**Our Pledge**: We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

## 🚀 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include details about your configuration and environment**

### Suggesting Features

If you have a suggestion for a new feature, please:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the proposed functionality**
- **Provide specific examples to demonstrate the use cases**
- **Describe any alternative solutions you've considered**

### Pull Requests

- Fork the repo and create your branch from `main`
- If you've added code that should be tested, add tests
- If you've changed APIs, update the documentation
- Ensure the test suite passes
- Make sure your code follows the existing code style
- Issue that pull request!

## 🛠️ Development Setup

### Prerequisites

- Node.js 18.17.0 or higher
- npm 9.0.0 or higher
- Git

### Getting Started

1. **Fork the repository**
   ```bash
   # Clone your fork
   git clone https://github.com/your-username/salespilots-io.git
   cd salespilots-io
   
   # Add the original repository as upstream
   git remote add upstream https://github.com/original-owner/salespilots-io.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your development credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure your code follows the project's style guidelines**
2. **Add tests for new functionality**
3. **Update documentation if needed**
4. **Ensure all tests pass**
5. **Update the CHANGELOG.md if applicable**

### Pull Request Guidelines

1. **Use a descriptive title** that clearly explains what the PR does
2. **Provide a detailed description** of the changes made
3. **Include screenshots or GIFs** for UI changes
4. **Reference any related issues** using keywords like "Fixes #123"
5. **Request reviews** from maintainers or contributors

### Review Process

1. **Automated checks** must pass (CI/CD, linting, tests)
2. **Code review** from at least one maintainer
3. **Address feedback** and make requested changes
4. **Maintainer approval** required for merge

## 📝 Code Style Guidelines

### General Principles

- **Readability over cleverness**
- **Consistency with existing codebase**
- **Clear and descriptive naming**
- **Proper error handling**
- **Security best practices**

### TypeScript/JavaScript

- Use TypeScript for all new code
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for consistency
- Prefer template literals over string concatenation
- Use destructuring when appropriate

### React/Next.js

- Use functional components with hooks
- Prefer composition over inheritance
- Use proper TypeScript interfaces for props
- Implement proper error boundaries
- Follow Next.js best practices

### CSS/Tailwind

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and sizing
- Use semantic color names
- Ensure accessibility compliance

## 🧪 Testing Guidelines

### Test Coverage

- **Unit tests** for utility functions and components
- **Integration tests** for API endpoints
- **E2E tests** for critical user flows
- **Accessibility tests** for UI components

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=ComponentName
```

### Writing Tests

- Use descriptive test names
- Test both success and failure cases
- Mock external dependencies
- Ensure tests are independent
- Use proper assertions

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
**Bug Description**
A clear and concise description of what the bug is.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
A clear and concise description of what you expected to happen.

**Actual Behavior**
A clear and concise description of what actually happened.

**Environment**
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Safari, Firefox]
- Version: [e.g. 22]
- Node.js version: [e.g. 18.17.0]

**Additional Context**
Add any other context about the problem here.
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Feature Description**
A clear and concise description of the feature you'd like to see.

**Problem Statement**
A clear and concise description of what problem this feature would solve.

**Proposed Solution**
A clear and concise description of what you want to happen.

**Alternative Solutions**
A clear and concise description of any alternative solutions you've considered.

**Additional Context**
Add any other context or screenshots about the feature request here.
```

## 📚 Additional Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Community

- [GitHub Discussions](https://github.com/your-username/salespilots-io/discussions)
- [Discord Community](https://discord.gg/salespilots)
- [Email Support](mailto:support@salespilots.io)

### Development Tools

- [VS Code Extensions](https://marketplace.visualstudio.com/search?term=salespilots)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools)

## 🙏 Recognition

Contributors will be recognized in:

- Project README.md
- Release notes
- Project documentation
- Community acknowledgments

---

## 🎉 Thank You!

Thank you for contributing to SalesPilots.io! Your contributions help make this platform better for businesses around the world.

**Questions?** Feel free to reach out to us at [support@salespilots.io](mailto:support@salespilots.io) or join our [Discord community](https://discord.gg/salespilots).

---

*Built with ❤️ by the SalesPilots team*
