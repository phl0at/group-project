# HyperComm

Welcome to HyperComm, your streamlined and efficient alternative to Discord. Designed with simplicity and performance in mind, HyperComm enables users to create and manage servers and channels effortlessly. Dive into seamless communication and foster vibrant communities with ease. Enjoy features like:

- Server and Channel Creation: Easily set up your own servers and channels to organize your discussions.
- Instant Messaging: Send and receive messages in real-time, ensuring smooth and uninterrupted conversations.
- User-Friendly Interface: Navigate through a clean, intuitive interface that prioritizes user experience.
- Community Building: Foster and grow your communities with tools designed to enhance interaction and engagement.

## Live Site

(https://hypercomm.onrender.com)

## [Wiki](https://github.com/DevStudenko/HyperComm/wiki)

## Technologies Used

<p align="left">
  <img src="https://user-images.githubusercontent.com/25181517/117447155-6a868a00-af3d-11eb-9cfe-245df15c9f3f.png" alt="JavaScript" width="40" style="margin-right: 10px;">
  <img src="https://user-images.githubusercontent.com/25181517/183897015-94a058a6-b86e-4e42-a37f-bf92061753e5.png" alt="React" width="40" style="margin-right: 10px;">
  <img src="https://user-images.githubusercontent.com/25181517/187896150-cc1dcb12-d490-445c-8e4d-1275cd2388d6.png" alt="Redux" width="40" style="margin-right: 10px;">
    <img src=https://user-images.githubusercontent.com/25181517/183423507-c056a6f9-1ba8-4312-a350-19bcbc5a8697.png alt="JavaScript" width="40" style="margin-right: 10px;">
  <img src="https://user-images.githubusercontent.com/25181517/117208740-bfb78400-adf5-11eb-97bb-09072b6bedfc.png" alt="PostgreSQL" width="40" style="margin-right: 10px;">
  <img src=  https://user-images.githubusercontent.com/25181517/183423775-2276e25d-d43d-4e58-890b-edbc88e915f7.png alt="PostgreSQL" width="40" style="margin-right: 10px;">
  <img src="https://user-images.githubusercontent.com/25181517/192158954-f88b5814-d510-4564-b285-dff7d6400dad.png" alt="HTML" width="40" style="margin-right: 10px;">
  <img src="https://user-images.githubusercontent.com/25181517/183898674-75a4a1b1-f960-4ea9-abcb-637170a00a75.png" alt="CSS" width="40" style="margin-right: 10px;">
  <img src="https://user-images.githubusercontent.com/25181517/192108372-f71d70ac-7ae6-4c0d-8395-51d8870c2ef0.png" alt="GIT" width="40">
  <img src=https://user-images.githubusercontent.com/25181517/117207330-263ba280-adf4-11eb-9b97-0ac5b40bc3be.png alt="GIT" width="40">
</p>

## Getting Started

To see HyperComm live, click the link above. To run HyperComm locally on your machine follow these steps:

- Clone the repository:

  - `git clone https://github.com/DevStudenko/HyperComm.git`

- Set up environment and local database:

  - In the root directory (same folder as .flaskenv), create a .env file and copy the following environment variables into it:
    - `SECRET_KEY=secret`
      - (set this to whatever you want)
    - `DATABASE_URL=sqlite:///dev.db`
    - `SCHEMA=hyper_comm_clone`
  - Still in the root directory, enter the following commands:

    - `pipenv install`
    - `pipenv shell`
    - `flask db migrate`
    - `flask db upgrade`
    - `flask seed all`
    - `pipenv run flask run`
      - (the backend localhost database should now be running on port 8080)

  - In a separate terminal, CD into react-app folder and run

    - `npm install`

  - And then to start the app enter:
    - `npm run dev`
