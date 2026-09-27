# AI Use During Development

## Tools used

Codex

## When I used it

I used Codex to plan the project architecture and during development.
First, I wrote an instruction set file which includes the scope which is considered the context for him,
Answering the triple Ws (What, why, who) of the project and highlighting any nuances.
Then I tried asking it high level questions about it making sure it understands the scope.

## Tasks AI helped with

Doing tasks was involved me writing the tasks in details and the ultimate goal then prompting it to plan the changes, then I checked multiple times the changes, then I did my own research about possible alternative solutions. I had to discard multiple times the suggested plan due to having better alternatives. For instance, AI decided to host the images on the frontend for some reason, I told him to be better host it in the backend due to the scope of the project. However in a normal environment, it's adviced to host it on cloudfront R2 or AWS S3 bucket.

## My involvement

My work was involved mostly around planning the tasks one by one, spawning different agents for different side of the code. I spawned multiple agents:

1. First agent for frontend
2. Second one for backend
3. Third one for database
4. security concerns

And then I had to tell each one of them the context, what to do, and correct after them.
For instance, one of the common rules is to challenge me as much as possible before taking a critical decision.
My number one rule was to create a transaction for operations.

## Verification

I made sure I ran all the new implementations by hand before adding an AI tests (automation). One none negotiable is that, important tests are ran before deployment therefore, added to workflows.

## Changes in direction

After making sure the project was working as it should, I had to change the direction of the project from being a simple project with an enterprise ready as the documentation proposed. Therefore, moving some functions to a different structure
especially in the backend was critical business logic, for instance, I added a new folder called policies, which isolated
the business critical logic.

## Remaining work

After this, I see the possible future integration is to:

1. Migrating from sqlite to posgres
2. Adding bills and receipts logic
3. Implement emailing service
4. Adding a payment gateway (i.e: NGenius,...)

## AI-generated learning material

AGENTS.md in each folder was instructed to follow exactly as the file proposed.
