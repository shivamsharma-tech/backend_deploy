pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS = credentials('Docker-access')  // Jenkins credential ID for Docker Hub
        DOCKER_IMAGE = 'shivamsharam/backend_deploy' // Docker image name
        EC2_CREDENTIALS = 'ubuntu' // Jenkins credential ID for EC2 private key
        EC2_USER = 'ubuntu' // or 'ubuntu' depending on your AMI
        EC2_IP = '13.60.90.245' // Replace with your EC2 instance public IP
    }

    stages {
        stage('Test Docker Access') {
            steps {
                sh 'docker ps'
            }
        }

        stage('Checkout SCM') {
            steps {
                git url: 'https://github.com/shivamsharma-tech/backend_deploy', branch: 'main'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: "Docker-access", usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh "echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin"
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                sh 'docker push $DOCKER_IMAGE:latest'
            }
        }

        stage('Deploy to AWS EC2') {
            steps {
                sshagent(credentials: ["$EC2_CREDENTIALS"]) {
                    sh '''
ssh -o StrictHostKeyChecking=no ubuntu@13.60.90.245 "
    sudo docker pull shivamsharam/backend_deploy &&
    sudo docker stop backend_deploy || true &&
    sudo docker rm backend_deploy || true &&
sudo docker run -d \
  --name backend_deploy \
  --add-host=host.docker.internal:host-gateway \
  -p 4000:4000 -p 5000:5000 \
  -e PORTS=4000,5000 \
  -e DATABASE_URL="postgresql://postgres:shivamsharma@database-1.c7is4wy26f2y.eu-north-1.rds.amazonaws.com:5432/prisma_db" \
  shivamsharam/backend_deploy:latest
"
'''
                }
            }
        }
        
    }

    post {
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed. Check logs.'
        }
    }
}
