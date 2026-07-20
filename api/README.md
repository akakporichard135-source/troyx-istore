# API Architecture

The App Router API routes under `app/api` provide production-ready interfaces with validation, rate-limit placeholders, CSRF checks for mutations, and provider abstraction points.

- `app/api/products`: catalog read endpoint.
- `app/api/search`: smart search over products, categories, colors, storage, and descriptions.
- `app/api/checkout`: checkout validation and payment-intent abstraction.
- `app/api/trade-in`: trade-in estimator with inspection disclaimer.
- `app/api/repair-booking`: repair appointment request endpoint.
- `app/api/ai/shopping-assistant`: AI assistant adapter placeholder.
- `app/api/admin/products`: protected admin product mutation placeholder.
