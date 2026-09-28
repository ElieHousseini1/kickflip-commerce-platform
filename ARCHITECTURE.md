# Architecture

## Project overview

     1. The frontend decides what the customer sees and how they interact with it for example forms, product cards, navigation, loading states and error messages.
     2. Backend is the trusted parter of the frontend, it validates input, authenticates users, checks business rules and does database work. The backend cannot trust the frontend in anything.
     3. Database: Stores accounts, products, variants, cart lines, wishlist entries, orders, order items and more.

## Database

### Data structure

     Tables:
     users: identity, email, password hash
     products: Catalog details, price in cents, stock, image key
     product_variants: Options belonging to a product
     cart_items: A user/product/variant combination and quantity
     wishlist_items: A user/product pair
     orders: Customer and delivery details, totals, order status
     order_items: Purchased names, variants, quantities and prices
     assets: Image key, MIME type, bytes and ETag
     schema_migrations: Which schema migrations have already run

### Important decisions

     I made the decision to pick SQLite because it makes local setup faster with a database server. Also it supports the transaction needed by checkout. However, it's limited in terms of scalability horizontally. I picked Sequelize because it keeps models and query code consistant by abstracting them. Also I took the decision to store amounts as cents to avoid floating-point persistence errors (a classic problem in floats).

### Database lifecycle

     Migrations make ordered and versioned schema changes, seeding inserts and updates the intial catalog data. An important check for was that Re-running the seed does not duplicate products.

### Data consistency

     Those were very critical for me to implement and showed up during brain storming:

     1. the total calculations to happen in the backend without trusting values sent by the browser. 2. A failure rolls back stock changes made earlier in the transaction.
     3. It rejects requests when the requested quantity exceeds stock.
     4. When changing the price, we should not rewrite an old order.
     5. It conditionally decrements stock to prevent overselling.
     6. It creates the order and its order items together.
     7. It clears the cart only after the order has been created.

## Backend

### Request flow

     POST /api/cart request first passes through security, rate-limiting, authentication, and Zod validation middleware. The controller extracts the authenticated user and passes the validated input to the cart service. The service verifies the product, variant, quantity, and available stock before opening a transaction. The repository then creates or updates the cart row through Sequelize and SQLite. Finally, the updated cart is serialized and returned with HTTP 201; expected failures receive clear status codes, while unexpected errors are logged and returned as a generic 500 response.

### Authentication and validation

     Passwords are validated before registration and hashed with bcrypt before being stored. After login, the API creates a signed timed JWT in HttpOnly cookie and stores a dash of the active session token in SQLite.

     Protected endpoints verify both the token and session record, the make sure it's the right user then define the scope of the cart, wishlist and order to that exact specific authenticated user.

     My policy is giving users the least previlages and scoping them accordingly.

     Zod was necessary to validate request's data before it reaches controllers or services. Frontend validation improves the user experience because it gives feedback however it's not sufficient because they can bypass it completely and send the request directly to the API. The backend must be independent by rejecting missing fields, invalid types, and limit permits.

### Business rules and errors

     Business rules are enforced in the service and policy layers. The backend calculates totals using current database prices and then it validates cart quantities and then checks stock again during checkout. All related transactions like stock updates, order creation, order-item creation, cart clearing all happen in one transaction so that failure rolls back the entire operation.

     Expected problems return clear status codes and messages. For example, 400 for invalid input, 401 for missing authentication, 404 for missing resources and 409 for insufficient stock. Not expected errors are logged with a request ID and the client receives a 500 response without any sensitive database details. It's important to monitor unexpected errors for future updates.

### Tradeoffs

     Using Express API allows the frontend and backend to be developed, tested and deployed independently. This layered structure separates concerns which makes it easier to maintain and test.

     However, it added complexity, for example, a simple request will pass through several layers. For a smaller project it feels a bit excessive but for an enterprise level, it provides clear boundaries as the application grows.

## Frontend

### Organization

     The app/ directory defines pages, layouts and loading or error boundaries. components/ contains reusable interface elements grouped by feature, such as products, carts checkout and authentication. Services/ handles communication with the backend API, while lib/ contains reusable helpers for formatting, calculations, and input handling. Styles/ contains shared CSS module styles.

### Rendering and state

     The server load intial product information directly from the API, while cleint components handle actions that require user interaction. Also we have providers that are shared to keep authentication, cart, wishlist and currency information in sync across the website. Persistant data are saved through the backend whereas temp values are managed locally.

### API communication and feedback

     Express communicates through a dedicated service files. Browser requests include the session and cookies while server-side requests. The frontend should provide indicators as well.

## Limitations and improvements

The current application uses pay-on-delivery but not online payments, confirmation emails, ordering history, or admin panels. Also SQLite is suitable for this project but would limit it horizontally. I would introduce PostgreSQL, pagination, shared rate limiting, background jobs....
