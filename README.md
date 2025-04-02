# Recipeasy

[Landing Rebuild is Here!](https://stupefied-morse-5e1233.netlify.com/)

[Backend Here!](https://github.com/dotEthan/Recipeasy-backend)

### Status

Rebuild Underway with Vue. Functionality is caught up, creating tests and adding new functionality. Redesign, using a proper design system required as prevoius CSS and HTML is not properly structured. 

Why Vue and not React or Angular? I Have already worked with React and Angular a great deal, both personally and professionally, so I wanted to see what differences there were and why so many praise Vue. 

So far it's really nice and feels orderly which is great. Easy to find what you need, easy to refactor and split. and Pinia works great with a really simple setup. No real negatives so far from what I can see.

## Overview and Thoughts

### What's Working

Almost everything currently functional is working. Filters, search, and tags are the major additions needed.

I've also been using this as a time to work with ChatGPT/Claude.ai to see how much easier it can make adapting the existing code to Vue, it has been a huge help, but only as an advisor. Any time I try to use it to create code, it becomes a huge headache.

### What isn't working

- paramquery parsing in WelcomeComponent needs better error checks

## Where are we?

### Working (not feature complete, full design still in progress):

- Learn Vue/Router/Store functionality through docs
- persistent authentication and Data storage(through firebase)
- Recipe Book Functionality (display, edit, crud with firebase)
- Auto deploy to netlify
- Shopping List Functionality
- Firebase image upload Signature
- Pinia store Implementation
- Routing and guards
- Authenticated User Image uploading (and deleting) to CDN
- Functional Mobile Design
- Public Recipes Displaying and functional

### Working on Now:

- Custom Backend Functionality using Expressjs, Nodejs, and MongoDB. (App up and running, auth working and fully secure, working. Schema creation/Validation and Recipe CRUD to come)
- reimplement verification code, same modal?

### In Progress (on hold as Backend Work On-Going)

- Switch from function to arrow functions & full prettier update
- Switch to id based routing instead of event based (recipe url slugs for sharing)
- Add Cuisine type & Nutritional Info (Edit and Display)
- Checking Basic Desktop design
- Testing (Vitest, Cypress) Current Coverage: 28%
- Form Accessibility (shopping list need "focus")

### To Come:

- Documentation (JSDocs)
- Tailor Cloudinary Image settings (refactor for new ExpressJS app)
- Route Guards
- TODO & Misc Functionality (Search, tags, rating, ignore/report recipe)
- Filter (Functional, but waiting on final schema)
- Error Handling & User feedback (loadin spinners, unsaved data etc)
- Defaults (images)
- TailwindCSS redesign
- Animations
- Display newly added Recipe Data (time, servings, nutritional info, etc)
- Offline Functionality
- User Dashboard
- Google/Facebook login (maybe)

### Future thoughts:

- Redesign
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
- Vitest
- Vue Testing Utils
- Vite

## Author

- **Ethan Strauss** - [Portfolio](https://dotethan.github.io)
