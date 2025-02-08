# User API Spec

## Register User

**Endpoint** : `POST /api/users`

**Request Body** :

```json
{
  "username": "user1",
  "password": "user123",
  "name": "User One"
}
```

**Response Body (Success)** :

```json
{
  "data": {
    "username": "user1",
    "name": "User One"
  }
}
```

**Response Body (Failed)** :

```json
{
  "errors": "Username must not blank, ..."
}
```

---

## Login User

**Endpoint** : `POST /api/users/login`

**Request Body** :

```json
{
  "username": "user1",
  "password": "user123"
}
```

**Response Body (Success)** :

```json
{
  "data": {
    "username": "user1",
    "name": "User One",
    "token": "uuid"
  }
}
```

**Response Body (Failed)** :

```json
{
  "errors": "Username or password wrong, ..."
}
```

---

## Get User

**Endpoint** : `GET /api/users/current`

**Request Header** :

- `X-API-TOKEN` : token

**Response Body (Success)** :

```json
{
  "data": {
    "username": "user1",
    "name": "User One"
  }
}
```

**Response Body (Failed)** :

```json
{
  "errors": "Unauthorized, ..."
}
```

---

## Update User

**Endpoint** : `PATCH /api/users/current`

**Request Header** :

- `X-API-TOKEN` : token

**Request Body** :

```json
{
  "password": "user123", // tidak wajib
  "name": "User One" // tidak wajib
}
```

**Response Body (Success)** :

```json
{
  "data": {
    "username": "user1",
    "name": "User One"
  }
}
```

**Response Body (Failed)** :

```json
{
  "errors": "Unauthorized, ..."
}
```

---

## Logout User

**Endpoint** : `DELETE /api/users/current`

**Request Header** :

- `X-API-TOKEN` : token

**Response Body (Success)** :

```json
{
  "data": "OK"
}
```

**Response Body (Failed)** :

```json
{
  "errors": "Unauthorized, ..."
}
```
