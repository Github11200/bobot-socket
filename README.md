# Robot Data Visualization

This repostiory is meant to be used with our [code](https://github.com/Github11200/Push-Back) for the 2025-2026 Vex Robotics season Push Back.

It contains a website for visualizing odometry and PID data in real time as the robot is moving.

## How it Works

The Logger class inside our Push Back repository sends messages in a CSV type format. These messages can contain the current position of the robot or the error term in a PID controller. All of these messages are sent through in real time using the built-in websocket in the VEX extension in VS Code.

## Screenshots

Odometry Visualization:
<img width="3116" height="2270" alt="image" src="https://github.com/user-attachments/assets/d75a5237-fa80-4899-ab3b-25d39c9f2446" />

PID Graphs;
<img width="3090" height="2270" alt="image" src="https://github.com/user-attachments/assets/17633d76-7f2b-41d5-8908-018e8dc71212" />
