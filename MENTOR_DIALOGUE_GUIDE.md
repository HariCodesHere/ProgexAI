# 🤖 AI Mentor Dialogue Editing Guide

This guide shows you how to customize the AI mentor's responses in your platform.

## 📍 File Location

`client/components/AIAssistant.tsx`

## 🎯 What You Can Edit

### 1. **Welcome Message** (Lines 46-48)

The first message users see when opening the AI assistant.

```typescript
content: "Hi! I'm your AI project mentor. I can help you with project planning, task prioritization, learning recommendations, and technical guidance. What would you like to work on today?",
```

**How to edit:** Change the text inside the quotes to your preferred welcome message.

### 2. **Welcome Suggestions** (Lines 51-54)

The initial suggestion buttons shown to users.

```typescript
suggestions: [
  "Help me plan my next project",
  "Analyze my current progress",
  "Suggest learning resources",
  "Review my project roadmap",
],
```

**How to edit:** Replace the text inside quotes with your preferred suggestions.

### 3. **Response Categories**

Each response is triggered by specific keywords:

#### 📊 **Project Planning** (Lines 85-96)

- **Triggers:** "project" + "plan"
- **Edit:** Lines 85-91 (the response text)
- **Edit:** Lines 92-97 (suggestion buttons)

#### 📈 **Progress Analysis** (Lines 109-125)

- **Triggers:** "progress" OR "analyze"
- **Edit:** Lines 109-119 (the response text)
- **Edit:** Lines 120-125 (suggestion buttons)

#### 📚 **Learning Recommendations** (Lines 131-149)

- **Triggers:** "learn" OR "course" OR "skill"
- **Edit:** Lines 131-143 (the response text)
- **Edit:** Lines 144-149 (suggestion buttons)

#### ⚙️ **Task Prioritization** (Lines 155-178)

- **Triggers:** "task" + "priority"
- **Edit:** Lines 155-172 (the response text)
- **Edit:** Lines 173-178 (suggestion buttons)

#### 💻 **Technical/Code Help** (Lines 184-207)

- **Triggers:** "code" OR "technical" OR "review"
- **Edit:** Lines 184-201 (the response text)
- **Edit:** Lines 202-207 (suggestion buttons)

#### 🌟 **Default Response** (Lines 210-223)

- **Triggers:** When no other keywords match
- **Edit:** Lines 210-217 (the response text)
- **Edit:** Lines 218-223 (suggestion buttons)

## 🚀 How to Add New Response Categories

1. **Add a new `else if` condition** after line 207:

```typescript
} else if (lowerMessage.includes("your-keyword")) {
  response = `Your custom response here...`;
  suggestions = [
    "Suggestion 1",
    "Suggestion 2",
    "Suggestion 3",
    "Suggestion 4",
  ];
```

2. **Multiple keyword triggers:**

```typescript
} else if (
  lowerMessage.includes("keyword1") ||
  lowerMessage.includes("keyword2") ||
  lowerMessage.includes("keyword3")
) {
  // Your response...
```

3. **Require multiple keywords:**

```typescript
} else if (
  lowerMessage.includes("keyword1") &&
  lowerMessage.includes("keyword2")
) {
  // Your response...
```

## 💡 Tips for Writing Good Responses

### ✅ **Do:**

- Use emojis and formatting for better readability
- Include dynamic data (like `${completedTasks}`, `${activeProjects}`)
- Provide actionable suggestions
- Keep responses helpful and encouraging
- Use bullet points and headers for structure

### ❌ **Don't:**

- Make responses too long (keep under 200 words)
- Use technical jargon without explanation
- Forget to include suggestion buttons
- Use overly complex language

## 🔄 Testing Your Changes

1. Save the file after making changes
2. The development server will automatically reload
3. Open the AI mentor chat
4. Test your keywords to see the new responses

## 📝 Example: Adding a "Motivation" Response

```typescript
} else if (
  lowerMessage.includes("motivat") ||
  lowerMessage.includes("stuck") ||
  lowerMessage.includes("discourag")
) {
  response = `I understand that coding can be challenging sometimes! 💪

**Remember:**
• Every expert was once a beginner
• Mistakes are learning opportunities
• Progress isn't always linear
• Small steps lead to big achievements

You've already completed ${completedTasks} tasks - that's amazing progress! Keep going! 🚀`;
  suggestions = [
    "Show my achievements",
    "Set a small goal",
    "Find learning resources",
    "Get technical help",
  ];
```

This would trigger when users type messages containing "motivation", "stuck", or "discouraged".

## 🎨 Formatting Tips

- Use `**bold text**` for emphasis
- Use `• bullet points` for lists
- Use emojis to make responses friendly
- Use `${variable}` to include dynamic data
- Use line breaks for readability

Happy customizing! 🎉
