# Recipe Book

This is a simple University project, which allows the user to sign in and browse recipes. User can also add recipes to favourites or create their own.

## Database

```mermaid
erDiagram ER
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
        int recipeId PK FK
        int categoryId PK FK
    }
    FAVOURITE {
        int userId PK FK
        int recipeId PK FK
    }

    USER ||--o{ RECIPE : "has many"
    RECIPE }o--|| USER : "belongs to"
    RECIPE ||--o{ RECIPECATEGORY : "has many"
    CATEGORY ||--o{ RECIPECATEGORY : "has many"
    RECIPECATEGORY }o--|| RECIPE : "belongs to"
    RECIPECATEGORY }o--|| CATEGORY : "belongs to"
    USER ||--o{ FAVOURITE : "has many"
    RECIPE ||--o{ FAVOURITE : "has many"
    FAVOURITE }o--|| USER : "belongs to"
    FAVOURITE }o--|| RECIPE : "belongs to"
```


## Running the project 

```bash
# install dependencies
pnpm install

# Start the development server
pnpm run dev

# Build the app
pnpm build

# Preview production
pnpm preview
```