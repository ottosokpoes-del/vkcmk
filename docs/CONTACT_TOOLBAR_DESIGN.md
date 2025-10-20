# Contact Toolbar Design Mockups

## Desktop View (Right Side Fixed)
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Website Content                                                │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  Main Content Area                                      │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │                                                 │   │   │
│  │  │  Page Content                                   │   │   │
│  │  │                                                 │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 📞 07006268722                                           │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ 💬 WhatsApp                                             │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ 💬 Messenger                                            │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ 💬 WeChat                                               │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ ✉️ Contact Us                                          │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Mobile View (Right Side Fixed)
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Website Content                                                │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  Main Content Area                                      │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │                                                 │   │   │
│  │  │  Page Content                                   │   │   │
│  │  │                                                 │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 📞                                                     │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ 💬                                                     │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ 💬                                                     │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ 💬                                                     │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ ✉️                                                     │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Design Specifications

### Colors
- **Background**: `bg-gray-900/95` (Dark gray with transparency)
- **Border**: `border-gray-700` (Subtle border)
- **Icons**: 
  - Phone: `text-yellow-400` (Bright yellow)
  - WhatsApp: `text-green-400` (Green)
  - Messenger: `text-blue-400` (Blue)
  - WeChat: `text-green-500` (Darker green)
  - Email: `text-yellow-400` (Bright yellow)

### Hover Effects
- **Desktop**: `hover:scale-105` (Slight scale up)
- **Mobile**: `active:scale-95` (Scale down on tap)
- **Glow**: `hover:shadow-lg` (Shadow effect)
- **Color Change**: `group-hover:text-yellow-300` (Text color change)

### Positioning
- **Desktop**: `fixed right-0 top-1/2` (Right edge, vertically centered)
- **Mobile**: `fixed right-4 top-1/2` (Right edge with margin, vertically centered)
- **Z-index**: `z-50` (Above all content)

### Responsive Behavior
- **Desktop**: Shows icons with text labels
- **Mobile**: Shows only icons, compact design
- **Touch-friendly**: Larger touch targets on mobile
- **Smooth transitions**: `transition-all duration-300`

### Professional Construction Equipment Style
- **Dark theme**: Matches heavy machinery aesthetic
- **High contrast**: Yellow accents on dark background
- **Clean lines**: Rounded corners with subtle shadows
- **Industrial feel**: Professional, trustworthy appearance
