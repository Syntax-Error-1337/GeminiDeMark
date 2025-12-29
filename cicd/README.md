# GeminiDeMark Docker Deployment

This directory contains the configuration files and scripts needed to deploy GeminiDeMark using Docker.

## Prerequisites

Before getting started, ensure you have Docker installed on your machine.

- **Docker Desktop**: [Download and Install](https://www.docker.com/products/docker-desktop/)
  - Follow the instructions for your operating system (Mac, Windows, or Linux).
  - Ensure Docker is running.

## Quick Start (Recommended)

We have provided a helper script to automate the deployment process.

1.  **Navigate to the `cicd` directory**:
    ```bash
    cd cicd
    ```

2.  **Make the script executable** (first time only):
    ```bash
    chmod +x deploy.sh
    ```

3.  **Run the deployment script**:
    ```bash
    ./deploy.sh
    ```

    This script will:
    - Stop any running containers.
    - Build the frontend and backend images.
    - Start the services in detached mode.

4.  **Access the Application**:
    - Open your browser and go to: [http://localhost](http://localhost)

## Manual Deployment

If you prefer to run Docker Compose commands directly:

1.  **Navigate to the `cicd` directory**:
    ```bash
    cd cicd
    ```

2.  **Build and Start**:
    ```bash
    docker-compose up -d --build
    ```

3.  **Stop**:
    ```bash
    docker-compose down
    ```

## Architecture

The deployment consists of three main services:

-   **Nginx (Reverse Proxy)**:
    -   Listens on Port `80`.
    -   Serves as the entry point.
    -   Proxies traffic to the Frontend and Backend.
-   **Frontend (Next.js)**:
    -   Internal Port: `3000`.
-   **Backend (Node.js)**:
    -   Internal Port: `8080`.

## Troubleshooting

-   **Port Conflicts**: Ensure ports `80`, `3000`, and `8080` are not being used by other applications.
-   **Permission Denied**: If you get a permission error running `./deploy.sh`, remember to run `chmod +x deploy.sh`.
