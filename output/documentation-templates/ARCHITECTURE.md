<!-- AI-provided outline only, not completed assessment documentation.
     Write the content independently in accordance with your assessment rules.
     Replace these prompts with your own explanations; do not submit the outline as completed work. -->

# Architecture

## Project overview

<!-- What does the application do?
     What are the frontend, backend, and database responsible for? -->

## Database

### Data structure

<!-- What tables exist?
     How do users, products, variants, carts, and orders relate? -->

### Important decisions

<!-- Why SQLite and Sequelize?
     Why store money in cents?
     Why store images as BLOBs?
     What are the disadvantages of these choices? -->

### Database lifecycle

<!-- What is the difference between migrations and seeding?
     What happens when the application starts? -->

### Data consistency

<!-- What does the checkout transaction protect?
     Why do order items preserve purchased names and prices? -->

## Backend

### Request flow

<!-- Follow one request through route, middleware, controller,
     service, repository, and database. -->

### Authentication and validation

<!-- How are passwords and sessions handled?
     How does the API identify the user and protect their data?
     Why is frontend validation insufficient? -->

### Business rules and errors

<!-- Where are totals and stock checked?
     How are expected and unexpected errors returned? -->

### Tradeoffs

<!-- Why a separate Express API?
     What does the layered structure help with?
     What complexity does it introduce? -->

## Frontend

### Organization

<!-- Explain app/, components/, services/, lib/, and styles/.
     Why are these responsibilities separated? -->

### Rendering and state

<!-- Which parts run on the server or need client behavior?
     What do the providers manage?
     What persists in the database versus temporary UI state? -->

### API communication and feedback

<!-- How do browser and server requests differ?
     How are loading, empty, and error states handled?
     How are database images displayed? -->

## Testing

<!-- What do unit, integration, and end-to-end tests check?
     What did you personally verify? -->

## Limitations and improvements

<!-- What is currently missing or simplified?
     What would you change if the application grew? -->
