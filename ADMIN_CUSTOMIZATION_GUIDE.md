# 🎨 Platform Customization Guide

This guide shows you how to customize every aspect of your AI-driven project management platform.

## 📁 Key Configuration Files

All customizable content is organized in easy-to-edit configuration files:

### 🏠 **Landing Page Content**

- **File:** `client/config/landingConfig.ts`
- **What you can edit:** Hero text, features, pricing, testimonials, company info

### 🤖 **AI Mentor Dialogues**

- **File:** `client/config/mentorConfig.ts`
- **What you can edit:** AI responses, personality, behavior, keywords

### 🎨 **Colors & Styling**

- **File:** `client/global.css`
- **What you can edit:** Color schemes, gradients, fonts

## 🏠 Landing Page Customization

### Quick Edits

Open `client/config/landingConfig.ts` and modify:

#### 1. **Company Information**

```typescript
company: {
  name: "YourCompany", // Change company name
  tagline: "Your tagline here", // Change tagline
  description: "Your description", // Footer description
},
```

#### 2. **Hero Section**

```typescript
hero: {
  title: "Your\nAwesome Title", // Main headline (use \n for line breaks)
  subtitle: "Your compelling subtitle here...", // Description
  primaryCTA: "Get Started", // Main button text
  secondaryCTA: "Watch Demo", // Secondary button text
},
```

#### 3. **Statistics**

```typescript
stats: [
  { number: "5k+", label: "Happy Users" }, // Edit numbers and labels
  { number: "15k+", label: "Projects Built" },
  // Add or remove stats as needed
],
```

#### 4. **Features Section**

```typescript
features: {
  title: "Your Features Title",
  subtitle: "Features description",
  list: [
    {
      title: "Feature Name",
      description: "Feature description",
      highlights: [
        "Benefit 1",
        "Benefit 2",
        "Benefit 3",
      ],
    },
    // Add more features or edit existing ones
  ],
},
```

#### 5. **Pricing Plans**

```typescript
pricing: {
  plans: [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for beginners",
      features: [
        "Feature 1",
        "Feature 2",
      ],
      cta: "Get Started",
      popular: false,
    },
    // Edit existing plans or add new ones
  ],
},
```

### Advanced Customization

#### **Adding New Sections**

1. Edit `landingConfig.ts` to add your content
2. Modify `client/pages/Landing.tsx` to display the new section
3. Add navigation links if needed

#### **Changing Navigation**

```typescript
navigation: [
  { label: "Features", href: "#features" },
  { label: "Your Section", href: "#your-section" }, // Add new nav item
],
```

## 🤖 AI Mentor Customization

### Quick Response Edits

Open `client/config/mentorConfig.ts`:

#### 1. **Welcome Message**

```typescript
welcome: {
  message: `Your custom welcome message here!

  Multiple lines supported with proper formatting.

  Add emojis and styling as needed! 🎉`,
  suggestions: [
    "Custom suggestion 1",
    "Custom suggestion 2",
  ],
},
```

#### 2. **Response Categories**

Each response category has:

- **Keywords** that trigger it
- **Message** template with variables
- **Suggestions** for follow-up

```typescript
projectPlanning: {
  keywords: ["project", "plan"], // Words that trigger this response
  requiresAll: true, // Must contain ALL keywords (false = any keyword)
  message: `Your custom response here...

  Use {variables} for dynamic content:
  - {activeProjects} - Number of active projects
  - {completedTasks} - Number of completed tasks
  - {avgProgress} - Average progress percentage

  Make it helpful and engaging!`,
  suggestions: [
    "Follow-up option 1",
    "Follow-up option 2",
  ],
},
```

#### 3. **Adding New Response Categories**

Add a new category to the `responses` object:

```typescript
yourNewCategory: {
  keywords: ["custom", "keyword"],
  requiresAll: false,
  message: `Your custom AI response for this category...`,
  suggestions: [
    "Relevant suggestion 1",
    "Relevant suggestion 2",
  ],
},
```

Then add the logic in `client/components/AIAssistant.tsx` around line 150:

```typescript
} else if (
  lowerMessage.includes("custom") ||
  lowerMessage.includes("keyword")
) {
  response = mentorConfig.responses.yourNewCategory.message;
  suggestions = mentorConfig.responses.yourNewCategory.suggestions;
```

#### 4. **Personality Settings**

```typescript
personality: {
  tone: "friendly", // friendly, professional, casual, enthusiastic
  useEmojis: true, // Include emojis in responses
  useBoldText: true, // Use **bold** formatting
  encouragementLevel: "high", // How motivational to be
},
```

### Available Variables in Responses

Use these variables in your message templates:

- `{activeProjects}` - Number of active projects
- `{completedTasks}` - Number of completed tasks
- `{projectCount}` - Total projects
- `{avgProgress}` - Average progress percentage
- `{techCount}` - Number of technologies used
- `{pendingTasks}` - Number of pending tasks

## 🎨 Visual Customization

### Colors & Themes

Edit `client/global.css` to change colors:

```css
:root {
  /* Primary Colors - Edit these hex values */
  --ai-purple: #8b5cf6;
  --ai-blue: #3b82f6;
  --ai-green: #10b981;
  --ai-orange: #f59e0b;

  /* Gradients */
  --ai-gradient: linear-gradient(135deg, var(--ai-purple), var(--ai-blue));
}
```

### Component Styling

Most components use Tailwind CSS classes. Key files to edit:

- `client/pages/Landing.tsx` - Landing page layout
- `client/pages/Index.tsx` - Dashboard layout
- `client/components/AIAssistant.tsx` - Chat interface

## 📱 Content Management

### Feature Flags

Enable/disable features in configuration files:

```typescript
// Landing page features
export const featureFlags = {
  showDemo: true, // Show demo button
  showPricing: true, // Show pricing section
  showTestimonials: true, // Show testimonials
  enableDarkMode: true, // Dark mode toggle
};

// AI mentor features
features: {
  codeReview: true, // AI code review responses
  learningPaths: true, // Learning recommendations
  motivationalSupport: true, // Encouragement responses
},
```

### Adding Testimonials

Edit the testimonials array in `landingConfig.ts`:

```typescript
testimonials: {
  list: [
    {
      name: "John Doe",
      role: "Student at MIT",
      avatar: "JD", // 2-letter initials
      quote: "This platform changed my life!",
      rating: 5, // 1-5 stars
    },
    // Add more testimonials
  ],
},
```

### Updating Contact Information

```typescript
export const contactInfo = {
  email: "your-email@domain.com",
  twitter: "@yourhandle",
  github: "yourusername",
  linkedin: "yourprofile",
};
```

## 🚀 Deployment Customization

### Environment-Specific Content

Create different config files for different environments:

- `landingConfig.dev.ts` - Development content
- `landingConfig.prod.ts` - Production content
- `landingConfig.staging.ts` - Staging content

Import the appropriate config based on environment.

### SEO & Meta Tags

Edit `index.html` to update:

```html
<title>Your Platform Name</title>
<meta name="description" content="Your platform description" />
<meta property="og:title" content="Your Platform Name" />
<meta property="og:description" content="Your description" />
```

## 🔧 Advanced Customization

### Custom Components

Create new components in `client/components/` and import them into pages.

### Custom Pages

1. Create new page file in `client/pages/`
2. Add route in `client/App.tsx`
3. Add navigation link where needed

### API Integration

- Edit `client/contexts/UserContext.tsx` for user management
- Add API calls in the contexts or create new service files

## 💡 Pro Tips

### 1. **Test Your Changes**

Always test changes in development before deploying:

```bash
npm run dev
```

### 2. **Backup Configuration**

Keep backups of your configuration files before making major changes.

### 3. **Consistent Branding**

Use the same colors, fonts, and tone across all components.

### 4. **Mobile-First**

Always test on mobile devices - most users will access on phones.

### 5. **Performance**

Keep images optimized and avoid large assets that slow loading.

## 🆘 Need Help?

### Common Issues

**Q: My changes aren't showing up**
A: Make sure you saved the file and the development server reloaded.

**Q: The AI responses aren't working**  
A: Check that your keywords are lowercase and properly formatted.

**Q: Colors aren't updating**
A: CSS changes might need a hard refresh (Ctrl+F5).

**Q: Modal/popup issues**
A: Check that you're using the correct state variables in the components.

### Support

If you need help with customization:

1. Check this guide first
2. Look at the existing code for examples
3. Test changes incrementally
4. Keep backups of working configurations

Happy customizing! 🎉
