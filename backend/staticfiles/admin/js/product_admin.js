document.addEventListener('DOMContentLoaded', function() {
    const sizePolicyField = document.getElementById('id_size_policy');
    if (!sizePolicyField) return;
    
    const stockQuantityRow = document.querySelector('.field-stock_quantity').closest('.form-row');
    const totalStockRow = document.querySelector('.field-total_stock_display')?.closest('.form-row');
    
    function updateFieldVisibility() {
        const sizePolicy = sizePolicyField.value;
        
        if (sizePolicy === 'single') {
            // Single size product: show stock field, hide total stock display
            if (stockQuantityRow) stockQuantityRow.style.display = '';
            if (totalStockRow) totalStockRow.style.display = 'none';
        } else {
            // Multiple sizes: hide stock field, show total stock display
            if (stockQuantityRow) stockQuantityRow.style.display = 'none';
            if (totalStockRow) totalStockRow.style.display = '';
        }
    }
    
    // Initial setup
    updateFieldVisibility();
    
    // Listen for changes
    sizePolicyField.addEventListener('change', updateFieldVisibility);
});