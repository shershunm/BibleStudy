# Contributing to Foundational Bible Study

Thank you for your interest in contributing to Foundational Bible Study! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/YOUR_USERNAME/BibleStudy/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (OS, browser, Node version)

### Suggesting Features

1. Check existing issues and discussions
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/BibleStudy.git
   cd BibleStudy
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   ```bash
   # Frontend
   cd frontend
   npm run dev

   # Backend
   cd backend
   node server.js
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Use conventional commits:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes
   - Link related issues

## Development Setup

See [README.md](./README.md) for detailed setup instructions.

## Code Style

- **JavaScript**: Use ES6+ features
- **React**: Functional components with hooks
- **CSS**: Use CSS variables for theming
- **Naming**: camelCase for variables, PascalCase for components

## Project Structure

- `frontend/src/components/` - React components
- `frontend/src/utils/` - Utility functions
- `backend/prisma/` - Database schema and seeds
- `backend/server.js` - Express API routes

## Adding New Features

### Adding a New Bible Translation

1. Add translation data to `backend/prisma/seed.js`
2. Update `BibleVersion` model if needed
3. Test with existing components

### Adding Map Locations

1. Edit `backend/prisma/seed-map-data.js`
2. Add location with bilingual data
3. Run seed script: `node prisma/seed-map-data.js`

### Adding UI Components

1. Create component in `frontend/src/components/`
2. Add corresponding CSS file
3. Import and use in parent component
4. Ensure bilingual support

## Questions?

Feel free to:
- Open an issue for discussion
- Contact the maintainers
- Join our community discussions

Thank you for contributing! 🙏
