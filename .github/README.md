# GitHub Actions Workflow Documentation

This directory contains the CI/CD pipeline configuration for the GeminiDeMark project.

## Overview

The pipeline is defined in `workflows/cicd.yml` and consists of two main stages:

1.  **Build and Push**: Builds Docker images for the Frontend and Backend and pushes them to the GitHub Container Registry (GHCR).
2.  **Deploy**: Connects to the production server via SSH and executes the deployment script.

## Triggers

The workflow runs automatically on:
-   **Push** to `main` or `master` branches.
-   **Pull Request** targeted at `main` or `master`.

*Note: The `deploy` job only runs on push events to the main/master branch.*

## Configuration (Secrets)

To enable deployment, the following **Repository Secrets** must be configured in your GitHub repository settings (`Settings` > `Secrets and variables` > `Actions`):

| Secret Name | Description | Example |
| :--- | :--- | :--- |
| `SSH_HOST` | The IP address or hostname of your production server. | `1.2.3.4` |
| `SSH_USER` | The username to log in to the server. | `ubuntu` |
| `SSH_PASSWORD` | The password for the SSH user. | `mypassword123` |
| `ENV_FILE` | The complete content of your `.env` file. | (See below) |

### `ENV_FILE` Content
Create a secret named `ENV_FILE` and paste the entire content of your backend `.env` file into it. Ensure it includes:
- `APP_BASE_URL=https://your-domain.com` (or http://server-ip:3000)
- Email Configuration (SMTP/SES)
- Database credentials

> **Note**: The `GITHUB_TOKEN` is automatically provided by GitHub Actions and is used to authenticate with GHCR.

## Jobs

### 1. `build-and-push`
-   **Runs on**: `ubuntu-latest`
-   **Permissions**: Read contents, Write packages.
-   **Steps**:
    -   Check out code.
    -   Log in to GHCR.
    -   Build and push Backend image (`ghcr.io/owner/repo-backend:tag`).
    -   Build and push Frontend image (`ghcr.io/owner/repo-frontend:tag`).

### 2. `deploy`
-   **Depends on**: `build-and-push`
-   **Condition**: Only runs on `push` to `main`/`master`.
-   **Steps**:
    -   Copies the `cicd/` directory to `/home/<user>/app` on the server.
    -   Executes the `deploy.sh` script on the server.
