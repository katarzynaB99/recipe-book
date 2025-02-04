# Recipe Book

This is a simple University project, which allows the user to sign in and browse recipes. User can also add recipes to favourites or create their own.

## Database

```mermaid
erDiagram
    USER {
        int id PK
        string username
        string password_hash
    }
    RECIPE {
        int id PK
        string title
        string description
        text instructions
        int prep_time
        int cook_time
        int userId FK
    }
    CATEGORY {
        int id PK
        string name
    }
    RECIPECATEGORY {
        int recipeId "PK FK"
        int categoryId "PK FK"
    }
    FAVOURITE {
        int userId "PK FK"
        int recipeId "PK FK"
    }

    USER ||--o{ RECIPE : "has many"
    RECIPE ||--o{ RECIPECATEGORY : "has many"
    CATEGORY ||--o{ RECIPECATEGORY : "has many"
    USER ||--o{ FAVOURITE : "has many"
    RECIPE ||--o{ FAVOURITE : "has many"
```


## Running the project 

```bash
# Start the database container
docker-compose up -d

# install dependencies
pnpm install

# Start the development server
pnpm run dev

# Build the app
pnpm build

# Preview production
pnpm preview
```
