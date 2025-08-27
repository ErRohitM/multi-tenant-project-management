from django.db import models
from autoslug import AutoSlugField

class BaseModel(models.Model):
    """
    Base model as parent model
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Fields to track the user who created or last updated the object
    # created_by = models.ForeignKey(
    #     settings.AUTH_USER_MODEL,
    #     on_delete=models.SET_NULL,
    #     null=True,  # Make it non-mandatory
    #     blank=True,  # Allow blank fields
    #     related_name='%(class)s_created',
    #     verbose_name='Created by'
    # )

class Organizations(BaseModel):
    """
    Organization model for multi-tenancy
    inherits BaseModel fields
    """
    name = models.CharField(max_length=100)
    contact_email = models.EmailField()
    slug = AutoSlugField(populate_from='get_org_slug', unique=True, blank=True)

    class Meta:
        ordering = ['name'] # object ordering

    # generates slug
    def get_org_slug(self):
        return f"{self.name}_{self.contact_email}_{self.created_at}"

    def __str__(self):
        return self.slug


class Projects(BaseModel):
    """
    Project model - organization dependent
    inherits BaseModel fields
    """

    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
        ('ON_HOLD', 'On Hold'),
    ]

    # many-to-one relation with organization
    organization = models.ForeignKey(
        Organizations,
        on_delete=models.CASCADE,
        related_name='projects'
    )
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    due_date = models.DateField(null=True, blank=True)
    slug = AutoSlugField(populate_from="get_project_slug", unique=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = [['organization', 'name']]

    def __str__(self):
        return f"{self.organization.name} - {self.name}"

    # generate custom project slug
    def get_project_slug(self):
        return f"{self.name}_{self.organization.name}"

    @property
    def task_count(self):
        return self.tasks.count()

    @property
    def completed_tasks_count(self):
        return self.tasks.filter(status='DONE').count()

    @property
    def completion_rate(self):
        if self.task_count == 0:
            return 0
        return (self.completed_tasks_count / self.task_count) * 100


class Tasks(BaseModel):
    """
    Task model - project dependent
    inherits BaseModel fields
    """

    TASK_STATUS_CHOICES = [
        ('TODO', 'To Do'),
        ('IN_PROGRESS', 'In Progress'),
        ('DONE', 'Done'),
    ]

    # many-to-one relation with project
    project = models.ForeignKey(
        Projects,
        on_delete=models.CASCADE,
        related_name='tasks'
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=TASK_STATUS_CHOICES, default='TODO')
    assignee_email = models.EmailField(blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    slug = AutoSlugField(populate_from="get_task_slug")

    class Meta:
        ordering = ['-created_at']

    # generate custom task slug
    def get_task_slug(self):
        return f"{self.title}_{self.project.name}"

    def __str__(self):
        return f"{self.project.name} - {self.title}"


class TaskComment(BaseModel):
    """
    TaskComment model for task discussions
    inherits BaseModel fields
    """

    task = models.ForeignKey(
        Tasks,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    content = models.TextField()
    author_email = models.EmailField()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Comment on {self.task.title} by {self.author_email}"