# 🎨 Alert System - Quick Reference Guide

## Using Alerts in Your Components

### 1. **Import Alert Component**
```javascript
import Alert from '../Component/Common/Alert';
```

### 2. **Setup State**
```javascript
const [alert, setAlert] = useState(null);
```

### 3. **Display Simple Alert**
```javascript
// Render in your JSX
{alert && (
  <Alert
    message={alert.message}
    type={alert.type}
    onClose={() => setAlert(null)}
    duration={5000}
  />
)}

// Show success alert
setAlert({ 
  type: 'success', 
  message: 'Operation completed!' 
});

// Show error alert
setAlert({ 
  type: 'error', 
  message: 'Something went wrong!' 
});

// Show warning alert
setAlert({ 
  type: 'warning', 
  message: 'Please review this action' 
});

// Show info alert
setAlert({ 
  type: 'info', 
  message: 'Here is some information' 
});
```

### 4. **Confirmation Dialog (Destructive Actions)**

**For single confirmation:**
```javascript
{alert && (
  <Alert
    message={alert.message}
    type={alert.type}
    onClose={() => setAlert(null)}
    duration={alert.isConfirmation ? 0 : 5000}
    isConfirmation={alert.isConfirmation}
    onConfirm={alert.onConfirm}
    onCancel={() => setAlert(null)}
  />
)}

// Show confirmation
const handleDelete = async (id) => {
  setAlert({
    type: 'warning',
    message: 'Are you sure? This cannot be undone.',
    isConfirmation: true,
    onConfirm: async () => {
      try {
        // Delete logic here
        await deleteAPI(id);
        setAlert({ 
          type: 'success', 
          message: 'Deleted successfully!' 
        });
      } catch (err) {
        setAlert({ 
          type: 'error', 
          message: err.message 
        });
      }
    }
  });
};
```

---

## 🎨 Alert Types & Colors

| Type | Icon | Color | Use Case |
|------|------|-------|----------|
| `error` | ⚠️ | Red | Failed operations, errors |
| `success` | ✓ | Emerald Green | Successful operations |
| `warning` | ⚡ | Amber | Confirmations, warnings |
| `info` | ℹ️ | Blue | General information |

---

## 📋 Complete Implementation Example

```javascript
import React, { useState } from 'react';
import Alert from '../Component/Common/Alert';

const MyComponent = () => {
  const [alert, setAlert] = useState(null);
  const [items, setItems] = useState([]);

  const handleDeleteItem = (id) => {
    setAlert({
      type: 'warning',
      message: 'Delete this item permanently? This action cannot be undone.',
      isConfirmation: true,
      onConfirm: async () => {
        try {
          // API call to delete
          await fetch(`/api/items/${id}`, { method: 'DELETE' });
          
          // Update state
          setItems(items.filter(item => item.id !== id));
          
          // Show success
          setAlert({ 
            type: 'success', 
            message: 'Item deleted successfully!' 
          });
        } catch (error) {
          setAlert({ 
            type: 'error', 
            message: 'Failed to delete: ' + error.message 
          });
        }
      }
    });
  };

  return (
    <div>
      {/* Alert Renderer */}
      {alert && (
        <div className="mb-4">
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
            duration={alert.isConfirmation ? 0 : 5000}
            isConfirmation={alert.isConfirmation}
            onConfirm={alert.onConfirm}
            onCancel={() => setAlert(null)}
          />
        </div>
      )}

      {/* Your component content */}
      <button onClick={() => handleDeleteItem('123')}>
        Delete Item
      </button>
    </div>
  );
};

export default MyComponent;
```

---

## ⚡ Pro Tips

1. **Always set duration to 0 for confirmations**
   ```javascript
   duration={alert.isConfirmation ? 0 : 5000}
   ```

2. **Provide clear, specific messages**
   - ✅ "Delete this blog? This action cannot be undone."
   - ❌ "Delete?"

3. **Use appropriate types**
   - `warning` for confirmations
   - `error` for failures
   - `success` for completed actions
   - `info` for informational messages

4. **Always handle errors gracefully**
   ```javascript
   onConfirm: async () => {
     try {
       // operation
       setAlert({ type: 'success', message: '...' });
     } catch (err) {
       setAlert({ type: 'error', message: err.message });
     }
   }
   ```

5. **Test in dark mode**
   - All alerts have dark mode variants
   - Use `dark:` classes for dark mode styling

---

## 🚫 Common Mistakes to Avoid

❌ **Wrong:**
```javascript
// Forgetting isConfirmation props
<Alert message={alert.message} type={alert.type} />

// Not handling confirmation callbacks
setAlert({ type: 'warning', message: 'Delete?' });

// Not setting duration to 0 for confirmations
duration={5000}  // ← Will auto-dismiss confirmation dialog!
```

✅ **Correct:**
```javascript
// Pass all confirmation props
<Alert
  message={alert.message}
  type={alert.type}
  duration={alert.isConfirmation ? 0 : 5000}
  isConfirmation={alert.isConfirmation}
  onConfirm={alert.onConfirm}
  onCancel={() => setAlert(null)}
/>

// Always provide onConfirm callback
setAlert({
  type: 'warning',
  message: 'Delete this item?',
  isConfirmation: true,
  onConfirm: async () => { /* action */ }
});
```

---

## 🔗 Related Files

- Component: `src/Component/Common/Alert.jsx`
- Usage Examples: `src/Component/Common/Comments.jsx`
- More Usage: `src/Pages/Drafts.jsx`

---

## ❓ FAQ

**Q: Can I customize the button text?**
A: Currently "Delete" and "Cancel" are fixed. Update `Alert.jsx` if you need different button text.

**Q: Can I stack multiple alerts?**
A: Not built-in. Each component has one alert state. For multiple, consider a toast system.

**Q: How long does the alert display?**
A: Default 5000ms (5 seconds). Pass `duration` prop to change. Use `0` for manual dismissal.

**Q: Does it work offline?**
A: Yes, it's purely frontend. Works in any network condition.

**Q: Can I add custom styling?**
A: Yes, pass `className` prop: `<Alert className="custom-class" />`

---

**Last Updated**: Today
**Status**: ✅ Production Ready
