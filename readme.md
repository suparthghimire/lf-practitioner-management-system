# Leapfrog Assignment - Practitioner Management System

Fullstack Application Written Assignment

---

## Techology Stack

The technology stack for the project is listed below

### Server

- <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png" width="15px"/> Typescript
- <img src="https://www.freepnglogos.com/uploads/logo-mysql-png/logo-mysql-mysql-logo-png-images-are-download-crazypng-21.png" width="15px"/> MySQL
- <img src="https://seeklogo.com/images/P/prisma-logo-3805665B69-seeklogo.com.png" width="15px"/> Prisma
- <img src="https://cdn.icon-icons.com/icons2/2699/PNG/512/expressjs_logo_icon_169185.png" width="15px"/> ExpressJS

---

## API Reference

### User

API Reference for User

#### Sign In

```http
  Post /signin
```

Validates email and password of user and returns access and refresh tokens

| Body       | Type     | Description                 |
| :--------- | :------- | :-------------------------- |
| `email`    | `string` | **Required**. User Email    |
| `password` | `string` | **Required**. User Password |

#### Signup

```http
  GET /signup
```

Creates new user

| Body              | Type     | Description                            |
| :---------------- | :------- | :------------------------------------- |
| `name`            | `string` | **Required**. Name of User             |
| `email`           | `string` | **Required**. Email of User            |
| `password`        | `string` | **Required**. Password of User         |
| `confirmPassword` | `string` | **Required**. Confirm Password of User |

#### Signout

```http
  Delete /signout
```

Clears refresh token from database and browser cookie

| Header          | Type     | Description                        |
| :-------------- | :------- | :--------------------------------- |
| `authorization` | `string` | **Required**. Access Token of User |

---

### Practitioner

API Reference for Practitioner

#### Index

```http
  Get /practitioner?page=1&limit=10
```

Gets all Practitioners with pagination

| Header          | Type     | Description                        |
| :-------------- | :------- | :--------------------------------- |
| `authorization` | `string` | **Required**. Access Token of User |

| query   | Type     | Description                              |
| :------ | :------- | :--------------------------------------- |
| `limit` | `number` | **Optional**. Limit for Data in One Page |
| `page`  | `number` | **Optional**. Page Number                |

#### Show

```http
  Get /practitioner/{practitioner_id}
```

Gets all Practitioners with pagination

| Header          | Type     | Description                        |
| :-------------- | :------- | :--------------------------------- |
| `authorization` | `string` | **Required**. Access Token of User |

| Parameters        | Type     | Description                   |
| :---------------- | :------- | :---------------------------- |
| `practitioner_id` | `number` | **Required**. Practitioner Id |

#### Create

```http
  Post /practitioner
```

Creates New Practitioner

| Header          | Type     | Description                        |
| :-------------- | :------- | :--------------------------------- |
| `authorization` | `string` | **Required**. Access Token of User |

| Body              | Type       | Description                                                         |
| :---------------- | :--------- | :------------------------------------------------------------------ |
| `fullname`        | `string`   | **Required**. Name of Practitioner                                  |
| `email`           | `string`   | **Required**. Email of Practitioner                                 |
| `contact`         | `string`   | **Required**. Contact of Practitioner                               |
| `dob`             | `DateTime` | **Required**. Date of Birth of Practitioner                         |
| `address`         | `string`   | **Required**. Address of Practitioner                               |
| `image`           | `File`     | **Required**. Display Picture of Practitioner                       |
| `icuSpecialist`   | `boolean`  | **Optional**. Yes if Practitioner is ICU Specialist                 |
| `startTime`       | `DateTime` | **Required**. Start time for Practitioner                           |
| `endTime`         | `DateTime` | **Required**. End time for Practitioner                             |
| `WorkingDays`     | `Array`    | **Required**. Array of Working Day of Practitioner (id and name)    |
| `Specializations` | `Array`    | **Required**. Array of Specialization of Practitioner (id and name) |

#### Update

```http
  Put /practitioner/{practitioner_id}
```

Updates Existing Practitioner

| Header          | Type     | Description                        |
| :-------------- | :------- | :--------------------------------- |
| `authorization` | `string` | **Required**. Access Token of User |

| Parameters        | Type     | Description                   |
| :---------------- | :------- | :---------------------------- |
| `practitioner_id` | `number` | **Required**. Practitioner Id |

| Body              | Type       | Description                                                         |
| :---------------- | :--------- | :------------------------------------------------------------------ |
| `fullname`        | `string`   | **Required**. Name of Practitioner                                  |
| `email`           | `string`   | **Required**. Email of Practitioner                                 |
| `contact`         | `string`   | **Required**. Contact of Practitioner                               |
| `dob`             | `DateTime` | **Required**. Date of Birth of Practitioner                         |
| `address`         | `string`   | **Required**. Address of Practitioner                               |
| `image`           | `File`     | **Required**. Display Picture of Practitioner                       |
| `icuSpecialist`   | `boolean`  | **Optional**. True or False for depending on Practitioner           |
| `startTime`       | `DateTime` | **Required**. Start time for Practitioner                           |
| `endTime`         | `DateTime` | **Required**. End time for Practitioner                             |
| `WorkingDays`     | `Array`    | **Required**. Array of Working Day of Practitioner (id and name)    |
| `Specializations` | `Array`    | **Required**. Array of Specialization of Practitioner (id and name) |

#### Delete

```http
  Delete /patient/{practitioner_id}
```

Deletes Existing Practitioner

| Header          | Type     | Description                        |
| :-------------- | :------- | :--------------------------------- |
| `authorization` | `string` | **Required**. Access Token of User |

| Parameters        | Type     | Description                   |
| :---------------- | :------- | :---------------------------- |
| `practitioner_id` | `number` | **Required**. Practitioner Id |

---

## Run

1. Clone the repository

```bash
  mkdir assignment-project
```

```bash
  cd assignment-project
```

```bash
  git clone https://github.com/suparthghimire/lf-practitioner-management-system.git
```

### Server

```bash
  cd server
```

1. Install Dependencies

```bash
  yarn
```

3. Setup Environment Variables based on .env.example

4. Initialize Prisma

```
  yarn prisma init
```

5. Run Migration

```
  yarn prisma migrate dev --name InitialMigration
```

6. Start the Development server

```
  yarn dev
```

---

## Author

[@suparthghimire](https://www.suparthnarayanghimire.com.np)
