# models.py
from django.db import models


class Product(models.Model):
    """
    Represents a product in the store.
    Maps to the 'Products' table in your original schema.
    """
    # In Django, if you don't specify a primary key, it automatically creates
    # an 'id' AutoField. We'll keep your original field name for clarity.
    product_id = models.AutoField(primary_key=True)
    product_name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        """Return a string representation of the product."""
        return self.product_name


class ProductImage(models.Model):
    """
    Represents an image associated with a product.
    Maps to the 'ProductImages' table in your original schema.
    """
    image_id = models.AutoField(primary_key=True)
    # The ForeignKey creates the relationship between ProductImage and Product
    # on_delete=CASCADE means if the product is deleted, its images are also deleted
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image_url = models.CharField(max_length=255)
    alt_text = models.CharField(max_length=255, null=True, blank=True)
    display_order = models.IntegerField(default=0)
    is_primary = models.BooleanField(default=False)

    def __str__(self):
        """Return a string representation of the product image."""
        return f"Image for {self.product.product_name}"


class ProductSize(models.Model):
    """
    Represents sizes available for products.
    Maps to the 'ProductSizes' table in your original schema.
    """
    size_id = models.AutoField(primary_key=True)
    size_name = models.CharField(max_length=100)
    size_code = models.CharField(max_length=50, unique=True)
    display_order = models.IntegerField(default=0)

    def __str__(self):
        return self.size_name


class ProductVariant(models.Model):
    """
    Represents a specific variant of a product (e.g., a product in a specific size).
    Maps to the 'ProductVariants' table in your original schema.
    """
    variant_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    size = models.ForeignKey(ProductSize, on_delete=models.CASCADE)
    sku = models.CharField(max_length=50, unique=True)
    price_adjustment = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    stock_quantity = models.IntegerField(default=0)
    reorder_threshold = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.product.product_name} - {self.size.size_name}"


class Category(models.Model):
    """
    Represents a product category, which can be hierarchical (categories can have subcategories).
    Maps to the 'Categories' table in your original schema.
    """
    category_id = models.AutoField(primary_key=True)
    # Self-referential foreign key for hierarchical categories
    parent_category = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    category_name = models.CharField(max_length=255, unique=True)
    description = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.category_name
    
    class Meta:
        verbose_name_plural = "Categories"


class ProductCategory(models.Model):
    """
    Represents the many-to-many relationship between products and categories.
    Maps to the 'ProductCategories' table in your original schema.
    """
    product_category_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.product.product_name} in {self.category.category_name}"
    
    class Meta:
        verbose_name_plural = "Product categories"


class ProductGroup(models.Model):
    """
    Represents a group of related products.
    Maps to the 'ProductGroups' table in your original schema.
    """
    group_id = models.AutoField(primary_key=True)
    group_name = models.CharField(max_length=255, unique=True)
    description = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.group_name


class ProductGroupMember(models.Model):
    """
    Represents the membership of a product in a product group.
    Maps to the 'ProductGroupMembers' table in your original schema.
    """
    member_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    group = models.ForeignKey(ProductGroup, on_delete=models.CASCADE, related_name='members')
    display_order = models.IntegerField(default=0)
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.product.product_name} in {self.group.group_name}"