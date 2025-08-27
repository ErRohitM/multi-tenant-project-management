import { gql } from '@apollo/client';

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      success
      errors
      project {
        id
        name
        description
        status
        dueDate
        taskCount
        completionRate
      }
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($input: UpdateProjectInput!) {
    updateProject(input: $input) {
      success
      errors
      project {
        id
        name
        description
        status
        dueDate
      }
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      success
      errors
      task {
        id
        title
        description
        status
        assigneeEmail
        dueDate
      }
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      success
      errors
      task {
        id
        title
        description
        status
        assigneeEmail
        dueDate
      }
    }
  }
`;

export const CREATE_TASK_COMMENT = gql`
  mutation CreateTaskComment($input: CreateTaskCommentInput!) {
    createTaskComment(input: $input) {
      success
      errors
      comment {
        id
        content
        authorEmail
        createdAt
      }
    }
  }
`;