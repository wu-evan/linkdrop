pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'linkdrop-backend'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build Docker Image') {
            steps {
                dir('backend') {
                    script {
                        sh 'docker build -t $DOCKER_IMAGE .'
                    }
                }
            }
        }
    }
}