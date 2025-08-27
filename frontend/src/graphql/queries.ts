import { gql } from '@apollo/client';

export const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    organizations {
      id
      name
      slug
      contactEmail
      createdAt
    }
  }
`;

export const GET_PROJECTS = gql`
  query GetProjects($organizationId: Int!) {
    projects(organizationId: $organizationId) {
      id
      name
      description
      status
      dueDate
      taskCount
      completedTasksCount
      completionRate
      createdAt
    }
  }
`;

export const GET_TASKS = gql`
  query GetTasks($projectId: Int!) {
    tasks(projectId: $projectId) {
      id
      title
      description
      status
      assigneeEmail
      dueDate
      createdAt
    }
  }
`;

export const GET_TASK_COMMENTS = gql`
  query GetTaskComments($taskId: Int!) {
    taskComments(taskId: $taskId) {
      id
      content
      authorEmail
      createdAt
    }
  }
`;

export const GET_PROJECT_STATS = gql`
  query GetProjectStats($organizationId: Int!) {
    projectStats(organizationId: $organizationId) {
      totalProjects
      activeProjects
      completedProjects
      totalTasks
      completedTasks
      overallCompletionRate
    }
  }
`;