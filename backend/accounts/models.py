from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager

class CustomUser(AbstractUser):
    """
    Custom user model with email as the unique identifier
    for authentication instead of username.
    """
    email = models.EmailField(_('email address'), unique=True)
    
    # Override username field to make it non-unique but keep it for compatibility
    # Django's default model requires a unique username, but we'll use email for login
    username = models.CharField(
        _('username'),
        max_length=150,
        blank=True,
        help_text=_('Optional. 150 characters or fewer.'),
    )
    
    # Make name fields optional
    first_name = models.CharField(_('first name'), max_length=150, blank=True)
    last_name = models.CharField(_('last name'), max_length=150, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # Email field is automatically required
    
    objects = CustomUserManager()
    
    def __str__(self):
        return self.email