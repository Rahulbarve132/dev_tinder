All API of the Dev Tinder

## Auth Routes
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password


## connectionRequestRouter
- POST /connection/send/:status/:userId

- POST /request/review/accept/:requestId
- POST /request/review/reject/:requestId

## user Router
- GET /user/connections
- GET /user/requests
- GET /user/feed Gets your profile to others user on plateform


status : ignore , intrested , accepted, rejected


