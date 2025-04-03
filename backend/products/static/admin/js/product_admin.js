document.addEventListener('DOMContentLoaded', function() {
    const sizePolicyField = document.getElementById('id_size_policy');
    if (!sizePolicyField) return;
    
    // Function to find the ProductVariantInline fieldset
    function findVariantFieldset() {
        const fieldsets = document.querySelectorAll('fieldset.module');
        for (let fieldset of fieldsets) {
            const legend = fieldset.querySelector('h2');
            if (legend && legend.textContent.includes('Product variants')) {
                return fieldset;
            }
        }
        return null;
    }
    
    // Function to toggle visibility based on size policy
    function updateFieldVisibility() {
        const sizePolicy = sizePolicyField.value;
        const stockQuantityRow = document.querySelector('.field-stock_quantity')?.closest('.form-row');
        const totalStockRow = document.querySelector('.field-total_stock_display')?.closest('.form-row');
        const variantFieldset = findVariantFieldset();
        
        if (sizePolicy === 'single') {
            // Single size product: show stock field, hide variants
            if (stockQuantityRow) stockQuantityRow.style.display = '';
            if (totalStockRow) totalStockRow.style.display = 'none';
            if (variantFieldset) variantFieldset.style.display = 'none';
        } else {
            // Multiple sizes: hide stock field, show variants
            if (stockQuantityRow) stockQuantityRow.style.display = 'none';
            if (totalStockRow) totalStockRow.style.display = '';
            if (variantFieldset) variantFieldset.style.display = '';
        }
    }
    
    // Initial setup
    updateFieldVisibility();
    
    // Listen for changes
    sizePolicyField.addEventListener('change', updateFieldVisibility);
});