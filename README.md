# MERN Stack Real-time Private Chat App with Pusher

This is a simple real-time chat app built using the MERN stack and Pusher. It is a private chat app where users can create an account, login, and chat with other users in real-time.

## Full Tutorial
- Medium - [MERN Stack Real-time Private Chat App with Pusher](https://medium.com/p/6b0b0b6c1b0a)

## Features
- Create an account
- Login
- Real-time chat
  - Online status
  - Typing indicator
  - Message delivery in real-time

## Technologies
- MongoDB
- Express
- Next.js
- Tailwind CSS
- Pusher

## Getting Started
### Clone the repository
```
git clone
```

### Backend setup

- Create a account [Pusher](https://pusher.com/) and create a new app
- Copy the credentials from the app dashboard
- Create a .env file in the backend folder from the `.env.example` file
- Replace the values in the .env file with your Pusher credentials
- Install dependencies
```
cd backend
yarn install
```
- Run the server
```
yarn dev
```

### Frontend setup
- Install dependencies
```
cd frontend
yarn install
```
- Create a .env file in the frontend folder from the `.env.example` file
- Replace the values in the .env file with your Pusher credentials
- Run the app
```
yarn dev
```