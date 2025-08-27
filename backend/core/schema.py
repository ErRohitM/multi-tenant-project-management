import graphene
from graphene_django import DjangoObjectType
from .models import Organizations, Projects, Tasks, TaskComment

# GraphQL Types
class OrganizationType(DjangoObjectType):
    class Meta:
        model = Organizations
        fields = ('id', 'name', 'slug', 'contact_email', 'created_at')


class ProjectType(DjangoObjectType):
    task_count = graphene.Int()
    completed_tasks_count = graphene.Int()
    completion_rate = graphene.Float()

    class Meta:
        model = Projects
        fields = ('id', 'name', 'description', 'status', 'due_date', 'created_at')

    def resolve_task_count(self, info):
        return self.task_count

    def resolve_completed_tasks_count(self, info):
        return self.completed_tasks_count

    def resolve_completion_rate(self, info):
        return self.completion_rate


class TaskType(DjangoObjectType):
    class Meta:
        model = Tasks
        fields = ('id', 'title', 'description', 'status', 'assignee_email', 'due_date', 'created_at')


class TaskCommentType(DjangoObjectType):
    class Meta:
        model = TaskComment
        fields = ('id', 'content', 'author_email', 'created_at')


# Project Statistics Type
class ProjectStatsType(graphene.ObjectType):
    total_projects = graphene.Int()
    active_projects = graphene.Int()
    completed_projects = graphene.Int()
    total_tasks = graphene.Int()
    completed_tasks = graphene.Int()
    overall_completion_rate = graphene.Float()


# Query Class
class Query(graphene.ObjectType):
    # Organization queries
    organizations = graphene.List(OrganizationType)
    organization = graphene.Field(OrganizationType, id=graphene.Int())

    # Project queries
    projects = graphene.List(ProjectType, organization_id=graphene.Int(required=True))
    project = graphene.Field(ProjectType, id=graphene.Int(required=True))

    # Task queries
    tasks = graphene.List(TaskType, project_id=graphene.Int(required=True))
    task = graphene.Field(TaskType, id=graphene.Int(required=True))

    # Comment queries
    task_comments = graphene.List(TaskCommentType, task_id=graphene.Int(required=True))

    # Statistics
    project_stats = graphene.Field(ProjectStatsType, organization_id=graphene.Int(required=True))

    def resolve_organizations(self, info):
        return Organizations.objects.all()

    def resolve_organization(self, info, id):
        return Organizations.objects.get(id=id)

    def resolve_projects(self, info, organization_id):
        return Projects.objects.filter(organization_id=organization_id)

    def resolve_project(self, info, id):
        return Projects.objects.get(id=id)

    def resolve_tasks(self, info, project_id):
        return Tasks.objects.filter(project_id=project_id)

    def resolve_task(self, info, id):
        return Tasks.objects.get(id=id)

    def resolve_task_comments(self, info, task_id):
        return TaskComment.objects.filter(task_id=task_id)

    def resolve_project_stats(self, info, organization_id):
        projects = Projects.objects.filter(organization_id=organization_id)
        tasks = Tasks.objects.filter(project__organization_id=organization_id)
        completed_tasks = tasks.filter(status='DONE')

        total_tasks_count = tasks.count()
        completed_tasks_count = completed_tasks.count()

        return ProjectStatsType(
            total_projects=projects.count(),
            active_projects=projects.filter(status='ACTIVE').count(),
            completed_projects=projects.filter(status='COMPLETED').count(),
            total_tasks=total_tasks_count,
            completed_tasks=completed_tasks_count,
            overall_completion_rate=(
                (completed_tasks_count / total_tasks_count) * 100
                if total_tasks_count > 0 else 0
            )
        )


# Mutation Input Types
class CreateProjectInput(graphene.InputObjectType):
    organization_id = graphene.Int(required=True)
    name = graphene.String(required=True)
    description = graphene.String()
    due_date = graphene.Date()


class UpdateProjectInput(graphene.InputObjectType):
    id = graphene.Int(required=True)
    name = graphene.String()
    description = graphene.String()
    status = graphene.String()
    due_date = graphene.Date()


class CreateTaskInput(graphene.InputObjectType):
    project_id = graphene.Int(required=True)
    title = graphene.String(required=True)
    description = graphene.String()
    assignee_email = graphene.String()
    due_date = graphene.DateTime()


class UpdateTaskInput(graphene.InputObjectType):
    id = graphene.Int(required=True)
    title = graphene.String()
    description = graphene.String()
    status = graphene.String()
    assignee_email = graphene.String()
    due_date = graphene.DateTime()


class CreateTaskCommentInput(graphene.InputObjectType):
    task_id = graphene.Int(required=True)
    content = graphene.String(required=True)
    author_email = graphene.String(required=True)


# Mutations
class CreateProject(graphene.Mutation):
    class Arguments:
        input = CreateProjectInput(required=True)

    project = graphene.Field(ProjectType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, input):
        try:
            organization = Organizations.objects.get(id=input.organization_id)
            project = Projects.objects.create(
                organization=organization,
                name=input.name,
                description=input.get('description', ''),
                due_date=input.get('due_date')
            )
            return CreateProject(project=project, success=True, errors=[])
        except Organizations.DoesNotExist:
            return CreateProject(project=None, success=False, errors=["Organization not found"])
        except Exception as e:
            return CreateProject(project=None, success=False, errors=[str(e)])


class UpdateProject(graphene.Mutation):
    class Arguments:
        input = UpdateProjectInput(required=True)

    project = graphene.Field(ProjectType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, input):
        try:
            project = Projects.objects.get(id=input.id)

            if input.get('name'):
                project.name = input.name
            if input.get('description') is not None:
                project.description = input.description
            if input.get('status'):
                project.status = input.status
            if input.get('due_date') is not None:
                project.due_date = input.due_date

            project.save()
            return UpdateProject(project=project, success=True, errors=[])
        except Projects.DoesNotExist:
            return UpdateProject(project=None, success=False, errors=["Project not found"])
        except Exception as e:
            return UpdateProject(project=None, success=False, errors=[str(e)])


class CreateTask(graphene.Mutation):
    class Arguments:
        input = CreateTaskInput(required=True)

    task = graphene.Field(TaskType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, input):
        try:
            project = Projects.objects.get(id=input.project_id)
            task = Tasks.objects.create(
                project=project,
                title=input.title,
                description=input.get('description', ''),
                assignee_email=input.get('assignee_email', ''),
                due_date=input.get('due_date')
            )
            return CreateTask(task=task, success=True, errors=[])
        except Projects.DoesNotExist:
            return CreateTask(task=None, success=False, errors=["Project not found"])
        except Exception as e:
            return CreateTask(task=None, success=False, errors=[str(e)])


class UpdateTask(graphene.Mutation):
    class Arguments:
        input = UpdateTaskInput(required=True)

    task = graphene.Field(TaskType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, input):
        try:
            task = Tasks.objects.get(id=input.id)

            if input.get('title'):
                task.title = input.title
            if input.get('description') is not None:
                task.description = input.description
            if input.get('status'):
                task.status = input.status
            if input.get('assignee_email') is not None:
                task.assignee_email = input.assignee_email
            if input.get('due_date') is not None:
                task.due_date = input.due_date

            task.save()
            return UpdateTask(task=task, success=True, errors=[])
        except Tasks.DoesNotExist:
            return UpdateTask(task=None, success=False, errors=["Task not found"])
        except Exception as e:
            return UpdateTask(task=None, success=False, errors=[str(e)])


class CreateTaskComment(graphene.Mutation):
    class Arguments:
        input = CreateTaskCommentInput(required=True)

    comment = graphene.Field(TaskCommentType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, input):
        try:
            task = Tasks.objects.get(id=input.task_id)
            comment = TaskComment.objects.create(
                task=task,
                content=input.content,
                author_email=input.author_email
            )
            return CreateTaskComment(comment=comment, success=True, errors=[])
        except Tasks.DoesNotExist:
            return CreateTaskComment(comment=None, success=False, errors=["Task not found"])
        except Exception as e:
            return CreateTaskComment(comment=None, success=False, errors=[str(e)])


class Mutation(graphene.ObjectType):
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    create_task_comment = CreateTaskComment.Field()


# Schema
schema = graphene.Schema(query=Query, mutation=Mutation)