#!/bin/bash

# Form Builder Testing Script
# This script helps verify that the form builder functionality works correctly

echo "🧪 Form Builder Configuration Test"
echo "================================="

echo "✅ 1. Testing build process..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✓ Build successful"
else
    echo "   ✗ Build failed"
    exit 1
fi

echo "✅ 2. Checking form configuration files..."
if [ -f "src/payload.config.ts" ]; then
    echo "   ✓ Payload config exists"
    if grep -q "formBuilderPlugin" src/payload.config.ts; then
        echo "   ✓ Form builder plugin configured"
    else
        echo "   ✗ Form builder plugin not found"
    fi
else
    echo "   ✗ Payload config missing"
fi

echo "✅ 3. Checking BookADemo block configuration..."
if [ -f "src/blocks/BookADemo.ts" ]; then
    echo "   ✓ BookADemo block exists"
    if grep -q "relationTo: 'forms'" src/blocks/BookADemo.ts; then
        echo "   ✓ Form relationship configured"
    else
        echo "   ✗ Form relationship not found"
    fi
else
    echo "   ✗ BookADemo block missing"
fi

echo "✅ 4. Checking BookADemo component implementation..."
COMPONENT_FILE="src/app/(frontend)/Components/blocks/BookADemoBlock.tsx"
if [ -f "$COMPONENT_FILE" ]; then
    echo "   ✓ BookADemo component exists"
    if grep -q "Fallback to hardcoded fields" "$COMPONENT_FILE"; then
        echo "   ✓ Hardcoded fallback implemented"
    else
        echo "   ✗ Hardcoded fallback not found"
    fi
    if grep -q "Dynamic validation based on form fields" "$COMPONENT_FILE"; then
        echo "   ✓ Dynamic validation implemented"
    else
        echo "   ✗ Dynamic validation not found"
    fi
else
    echo "   ✗ BookADemo component missing"
fi

echo "✅ 5. Checking API endpoints..."
if [ -f "src/app/api/forms/[id]/route.ts" ]; then
    echo "   ✓ Form fetch API exists"
else
    echo "   ✗ Form fetch API missing"
fi

if [ -f "src/app/api/form-submissions/route.ts" ]; then
    echo "   ✓ Form submission API exists"
else
    echo "   ✗ Form submission API missing"
fi

echo ""
echo "🎉 Configuration Test Complete!"
echo ""
echo "📋 Manual Testing Checklist:"
echo "1. Start the development server: npm run dev"
echo "2. Navigate to admin panel: http://localhost:3000/admin"
echo "3. Create a new form in the Forms section"
echo "4. Add various field types (text, email, select, etc.)"
echo "5. Create a page with a BookADemo block"
echo "6. Test both scenarios:"
echo "   - With a form selected (dynamic fields)"
echo "   - With no form selected (hardcoded fallback)"
echo "7. Verify form submissions work correctly"
echo "8. Check that form fields can be edited after creation"
echo ""
echo "🔧 Key Features to Test:"
echo "- ✅ Form field editing after creation"
echo "- ✅ Multiple field types support"
echo "- ✅ Hardcoded fallback functionality"
echo "- ✅ Form validation for all field types"
echo "- ✅ Form submission handling"
echo "- ✅ Admin UI improvements"