from django.core.management.base import BaseCommand
from datetime import date, datetime, timedelta

from ...models import Organizations, Projects, Tasks, TaskComment

class Command(BaseCommand):
    help = 'Create sample data for testing'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Creating sample data...'))

        # Create Organizations
        org1 = Organizations.objects.get_or_create(
            name='TechCorp Inc.',
            slug='techcorp-inc',
            contact_email='admin@techcorp.com'
        )[0]

        org2 = Organizations.objects.get_or_create(
            name='StartupXYZ',
            slug='startupxyz',
            contact_email='hello@startupxyz.com'
        )[0]

        # Create Projects for TechCorp
        project1 = Projects.objects.get_or_create(
            organization=org1,
            name='Website Redesign',
            description='Complete overhaul of company website',
            status='ACTIVE',
            due_date=date.today() + timedelta(days=30)
        )[0]

        project2 = Projects.objects.get_or_create(
            organization=org1,
            name='Mobile App Development',
            description='Build native mobile application',
            status='ACTIVE',
            due_date=date.today() + timedelta(days=60)
        )[0]

        # Create Projects for StartupXYZ
        project3 = Projects.objects.get_or_create(
            organization=org2,
            name='MVP Development',
            description='Build minimum viable product',
            status='ACTIVE',
            due_date=date.today() + timedelta(days=45)
        )[0]

        # Create Tasks for Website Redesign
        task1 = Tasks.objects.get_or_create(
            project=project1,
            title='Design Homepage',
            description='Create new homepage design mockups',
            status='DONE',
            assignee_email='designer@techcorp.com',
            due_date=datetime.now() + timedelta(days=5)
        )[0]

        task2 = Tasks.objects.get_or_create(
            project=project1,
            title='Implement Responsive Layout',
            description='Make website mobile-friendly',
            status='IN_PROGRESS',
            assignee_email='developer@techcorp.com',
            due_date=datetime.now() + timedelta(days=15)
        )[0]

        task3 = Tasks.objects.get_or_create(
            project=project1,
            title='Content Migration',
            description='Migrate existing content to new design',
            status='TODO',
            assignee_email='content@techcorp.com',
            due_date=datetime.now() + timedelta(days=20)
        )[0]

        # Create Taskss for Mobile App
        task4 = Tasks.objects.get_or_create(
            project=project2,
            title='Setup Development Environment',
            description='Configure React Native development setup',
            status='DONE',
            assignee_email='mobile.dev@techcorp.com',
            due_date=datetime.now() + timedelta(days=3)
        )[0]

        task5 = Tasks.objects.get_or_create(
            project=project2,
            title='Create Login Screen',
            description='Implement user authentication screen',
            status='IN_PROGRESS',
            assignee_email='mobile.dev@techcorp.com',
            due_date=datetime.now() + timedelta(days=10)
        )[0]

        # Create Tasks for MVP
        task6 = Tasks.objects.get_or_create(
            project=project3,
            title='User Research',
            description='Conduct interviews with potential users',
            status='DONE',
            assignee_email='research@startupxyz.com',
            due_date=datetime.now() + timedelta(days=7)
        )[0]

        task7 = Tasks.objects.get_or_create(
            project=project3,
            title='Build Core Features',
            description='Implement main application features',
            status='IN_PROGRESS',
            assignee_email='dev@startupxyz.com',
            due_date=datetime.now() + timedelta(days=25)
        )[0]

        # Create Comments
        TaskComment.objects.get_or_create(
            task=task1,
            content='Great work on the homepage design! Looking forward to the next iteration.',
            author_email='manager@techcorp.com'
        )

        TaskComment.objects.get_or_create(
            task=task2,
            content='The responsive layout is coming along nicely. Need to test on more devices.',
            author_email='qa@techcorp.com'
        )

        TaskComment.objects.get_or_create(
            task=task6,
            content='User interviews revealed some interesting insights about feature priorities.',
            author_email='product@startupxyz.com'
        )

        self.stdout.write(
            self.style.SUCCESS('Successfully created sample data!')
        )
        self.stdout.write('Organizations: 2')
        self.stdout.write('Projects: 3')
        self.stdout.write('Tasks: 7')
        self.stdout.write('Comments: 3')