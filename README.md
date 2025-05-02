# [StudyVerse] : [8]
# Members
Project Manager: Kameron Arceneaux (kamarceneaux)\
Communications Lead: [Marcus Reese] (MarcusReese1)\
Git Master: [Ryan Lam] (ryantroy43)\
Design Lead: [Alanna Reeves-Miller] (areev25)\
Quality Assurance Tester: Queban Lee (queban)\
Qualiry Assurance Tester: Tyler (Lynx) Lallande (tylerlallande)


# About Our Software

Let’s get ready for take off with this NEW innovative site called Study Verse. Study verse is an interactive website that makes studying more than just a one dimensional thing. With this web page you can add users, unlock new study levels to compare your process to others, and many more exciting features. 

For those who are pilled with task/ events, you can create a reminder in the calendar to let you know when those task are due. 
Now, we didn’t forget about those who like those short study sessions or even those who like to take breaks in between. We integrated a timer into the web page to make sure users stay on time.

## Platforms Tested on
- Modern day web browsers on mobile and desktop.
  
# Important Links
Kanban Board: (https://github.com/orgs/CSC-3380-Spring-2025/projects/10)[https://github.com/orgs/CSC-3380-Spring-2025/projects/10]
Designs: [link]\
Styles Guide(s): [link]

# How to Run Dev and Test Environment

## Preliminaries
1. Have Node.js installed on your machine
2. Have the ASP.NET runtime and also the .NET sdk versions >9.0.0 installed on your machine.
3. Make sure the .env file is present on your machine. The .env file is found in the OneDrive. 
4. The file should be placed in the Team-8 directory and the file structure should reflect the one on the bottom.

```
|
|- Team-8
	|
	|
	|- backend/
		|
		|-...
	|- frontend/
		|
		|-...
	|- .env
```

## Running the project
The project is broken into two separate folders: frontend and backend. You can open each folder separately in VSCode or whatever editor for full support of each commands.
Example, to access the npm run dev command you must be inside the frontend folder.

To actually run the full stack implementation of the project:
1. In the terminal, change directory into the 'frontend' folder.
```terminal
cd frontend
```
2. Type in `npm install` to run all the frontend dependencies
```terminal
npm install 
```
3. Following that, to run both projects simulatneously, you can run `npm run dev`
```terminal
npm run dev
```

## To run the dotnet project by itself
1. Open the backend folder in the editor of your choice
2. Type in `dotnet run` in the terminal to run the project.

> Note: You may have to build the project to run it sometimes or incase project dependencies on the backend change, to do this you need to run: `dotnet build` in the terminal.

## Commands
Describe how the commands and process to launch the project on the main branch in such a way that anyone working on the project knows how to check the affects of any code they add.


```c#
static void Main(){
	Console.WriteLine("Hello, World!");
}
```
