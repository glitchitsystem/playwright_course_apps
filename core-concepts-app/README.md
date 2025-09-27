# Playwright Core Concepts Practice App

A front-end application designed for practicing Playwright core concepts including browser contexts, test isolation, and fixtures.

## 🚀 Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
   ```

3. **Open your browser:**
   The app will automatically open at `http://localhost:3000`

## 📖 What You'll Practice

### Browser & Context Concepts

- **Context A & B Pages**: Practice working with different browser contexts
- **State Isolation**: See how contexts maintain separate state
- **Navigation**: Test page navigation within contexts

### Test Independence

- **Isolation Test Page**: Practice creating independent tests
- **Shared State Demo**: Learn what NOT to do with test state
- **Reset Scenarios**: Practice cleaning up between tests

## 🎯 Learning Objectives

### Section 2: Core Concepts

- **Lecture 13**: Automated Testing Rule - Keep Tests Independent
- **Lecture 14**: Browser and Context
- **Lecture 15**: Test isolation
- **Lecture 16**: Built-in fixtures
- **Lecture 17**: Setting up Playwright without the init command
- **Lecture 18**: Lab 2 - Boilerplate Project

## 📁 Page Structure

```
├── index.html              # Home page with navigation
├── context.html          # Browser Context A demo
├── context-b.html          # Browser Context B demo
├── isolation-test.html     # Test isolation practice scenarios
├── shared-state.html       # Shared state problems demonstration
├── styles.css              # Application styles
└── server.js               # Development server
```

## 🧪 Test Scenarios

### Context Isolation

- Navigate between Context A and Context B
- Fill forms and counters in each context
- Verify state remains separate between contexts

### Test Independence Practice

1. **Form Submission**: Practice independent form tests
2. **Todo List**: Add/remove items without affecting other tests
3. **Toggle States**: Enable/disable features independently
4. **Data Table**: Add/sort/delete rows in isolation

### Shared State Problems

- See how persistent localStorage breaks tests
- Practice identifying state leakage issues
- Learn cleanup strategies

## 🎨 Interactive Elements

- **Counters**: Test state persistence and reset
- **Forms**: Practice form validation and submission
- **Authentication**: Mock login/logout scenarios
- **Data Tables**: Sortable/filterable content
- **Todo Lists**: Dynamic content management

## 🛠️ Development

- **Framework**: Plain HTML/CSS/JavaScript (no framework dependencies)
- **Server**: Express.js for development
- **Port**: 3000 (configurable in server.js)

## 📝 Test Ideas

Use this app to practice writing Playwright tests for:

- Page navigation and routing
- Form interactions and validation
- State management across page reloads
- Browser context isolation
- Element visibility and interaction
- Data persistence scenarios

## 🚫 Common Testing Pitfalls Demonstrated

The **Shared State Demo** page specifically shows:

- Global counters that persist between tests
- Form data that carries over between sessions
- Authentication state that affects subsequent tests
- How to identify and fix these issues

## 💡 Best Practices Reinforced

- Always start tests with clean state
- Use browser contexts for isolation
- Reset data between test runs
- Avoid dependencies between tests
- Clear storage/cookies when needed

---

**Perfect for**: Playwright beginners learning core concepts, test isolation, and browser context management.
