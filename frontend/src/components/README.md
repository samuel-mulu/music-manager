# Component Library

This directory contains all reusable components organized by category.

## 📁 Directory Structure

```
src/components/
├── ui/                    # UI Components
│   ├── Button.tsx         # Button component with variants
│   ├── Card.tsx           # Card component with hover effects
│   ├── Input.tsx          # Input and Select components
│   ├── Badge.tsx          # Badge component with variants
│   ├── Modal.tsx          # Modal overlay and content
│   ├── Spinner.tsx        # Loading spinner
│   ├── Alert.tsx          # Alert component with variants
│   └── index.ts           # UI components export
├── layout/                # Layout Components
│   ├── AppContainer.tsx   # App layout components
│   └── index.ts           # Layout components export
├── index.ts               # All components export
└── README.md              # This file
```

## 🎨 UI Components

### Button

```tsx
import { Button } from './components/ui';

<Button variant="primary" size="lg">Click me</Button>
<Button variant="success">Success</Button>
<Button variant="ghost" size="sm">Ghost</Button>
```

**Variants**: `primary`, `secondary`, `success`, `warning`, `danger`, `ghost`
**Sizes**: `sm`, `md`, `lg`

### Card

```tsx
import { Card } from "./components/ui";

<Card hover={true}>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>;
```

### Input & Select

```tsx
import { Input, Select } from './components/ui';

<Input placeholder="Enter text" />
<Select>
  <option>Option 1</option>
</Select>
```

### Badge

```tsx
import { Badge } from './components/ui';

<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
```

**Variants**: `primary`, `secondary`, `success`, `warning`, `danger`

### Modal

```tsx
import { ModalOverlay, ModalContent } from "./components/ui";

<ModalOverlay>
  <ModalContent>
    <h2>Modal Title</h2>
    <p>Modal content</p>
  </ModalContent>
</ModalOverlay>;
```

### Spinner

```tsx
import { Spinner } from "./components/ui";

<Spinner />;
```

### Alert

```tsx
import { Alert } from './components/ui';

<Alert variant="success">Success message</Alert>
<Alert variant="error">Error message</Alert>
```

**Variants**: `info`, `success`, `warning`, `error`

## 🏗️ Layout Components

### App Container

```tsx
import {
  AppContainer,
  Header,
  HeaderContent,
  Logo,
  LogoIcon,
  Title,
  Subtitle,
  MainContent,
  Footer,
} from "./components/layout";

<AppContainer>
  <Header>
    <HeaderContent>
      <Logo>
        <LogoIcon>🎵</LogoIcon>
        <div>
          <Title>App Title</Title>
          <Subtitle>App subtitle</Subtitle>
        </div>
      </Logo>
    </HeaderContent>
  </Header>

  <MainContent>{/* Your content */}</MainContent>

  <Footer>
    <p>Footer content</p>
  </Footer>
</AppContainer>;
```

## 📦 Import Options

### Import All Components

```tsx
import {
  Button,
  Card,
  Input,
  Select,
  Badge,
  ModalOverlay,
  ModalContent,
  Spinner,
  Alert,
} from "./components";
```

### Import UI Components Only

```tsx
import {
  Button,
  Card,
  Input,
  Select,
  Badge,
  ModalOverlay,
  ModalContent,
  Spinner,
  Alert,
} from "./components/ui";
```

### Import Layout Components Only

```tsx
import {
  AppContainer,
  Header,
  HeaderContent,
  Logo,
  LogoIcon,
  Title,
  Subtitle,
  MainContent,
  Footer,
} from "./components/layout";
```

### Import Individual Components

```tsx
import { Button } from "./components/ui/Button";
import { AppContainer } from "./components/layout/AppContainer";
```

## 🎯 Features

- ✅ **TypeScript Support**: Full type safety with variants
- ✅ **Emotion Styled**: CSS-in-JS with theme support
- ✅ **Accessibility**: Focus states, proper contrast
- ✅ **Performance**: Optimized CSS with minimal re-renders
- ✅ **Consistency**: Unified design system
- ✅ **Responsive**: Works on all screen sizes
- ✅ **Professional**: Enterprise-ready styling

## 🔧 Customization

All components use Emotion's `styled` function and support theme customization through the ThemeProvider. You can extend the theme in your App.tsx to customize colors, spacing, and typography.

## 📝 Usage in SongsList

The components are already integrated into your SongsList component and can be used throughout your application for consistent styling.
