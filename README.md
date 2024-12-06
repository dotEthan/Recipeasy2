# Recipeasy

[Landing Rebuild is Here!](https://stupefied-morse-5e1233.netlify.com/)

### Status

Rebuild Underway with Vue. Functionality is almost all there again, though new Recipes functionality and final shopping list work coming tomorrow or Sunday. Now the design needs fixing.

Why Vue and not React or Angular? I Have already worked with React and Angular a great deal, both personally and professionally, but I've heard a lot about how Vue is so nice to work with, so I wanted to see what differences there were and why they mattered. So far it's really nice and feels orderly which is great. Easy to find what you need, easy to refactor and split. and Pinia works great with a really simple setup. No real negatives so far from what I can see.

## Overview and Thoughts

### What's Working

Almost everything is working. A couple more pages to add, some tests to build, and then the transitional animations, but otherwise it's been relatively smooth sailing.

I've also been using this as a time to work with ChatGPT to see how much easier it can make adapting the existing code to Vue, it has been a huge help, thoguh it has had a few "halucinations" along the way that wasted some time, but over all I'd say a huge time saver for refactoring, learning, and as a real time "Stackoverflow".

### What isn't working

Tried using AI to complete a full feature, it worked, but took far longer as it got very confused regarding syntax changes between versions, and kept getting locked into cyclical changes. 

- On mobile, click and drag, app slides?

## Where are we?

### Working (not feature complete, full design still in progress):

- Learn Vue/Router/Store functionality thought docs
- persistent authentication and Data storage(through firebase)
- Recipe Book Functionality (display, edit, crud with firebase)
- Auto deploy to netlify
- Shopping List Functionality
- Firebase image upload Signature
- Pinia store Implementation
- Routing and guards
- Authenticated User Image uploading (and deleting) to CDN
- Welcome Page basic Redesign

### Working on Now:

- Basic Responsive design (left: Recipes, Shopping Lists)
- Filter (Functional, but new design coming)
- "Public" recipe display/search
- Ensure TestMode doesn't last through reloads or sessions.

### To Come:

- Animations/Testing
- User Dashboard
- Error Handling & User feedback (loadin spinners, etc)
- All //TODO comments
- Display newly added Recipe Data (time, nutritional info, etc)

- Defaults (images)
- Google/Facebook login (maybe)

### Future thoughts:

- Redesign
- bespoke Backend Functionality
- Meal Planning & Calendar
- Website Parsing to allow importing recipes
- Calorie counter

## Built With

- HTML
- SASS
- JavaScript
- Vue (originally Angular)
- TypeScript
- Sass
- Karma
- Jasmine
- Vite

## Author

- **Ethan Strauss** - [Portfolio](https://dotethan.github.io)
