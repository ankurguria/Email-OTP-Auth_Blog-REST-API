# Blog-REST-API with Email OTP Authentication 
   This is a REST API for a blog with authentication (signup and login) only through OTP verification over email.

### Project setup:
- clone this repo. "cd" into the repo
- run "npm install"
- create a ```.env``` file with following content (do not change the variable names; change only the values):
  ```
  MONGO_URL = <MongoDB connection URL>
  JWT_SECRET = Ilovenodejs
  NODEMAILER_HOST = gmail (or yahoo etc.)
  SENDER = sender_email_ID (e.g. your email ID)
  SENDER_PASSWORD = sender_email_ID_password
  ```
- run "npm run start"

### Available APIs:

#### Authentication:
- /getotp
- /signup/
- /signup/verifyotp
- /login

#### Middleware:
- verifyToken

#### Posts:
- / (create post)
- /:post_id/delete
- /:post_id/comment
- /:post_id/getComments
- /:post_id/likeDislike


Enjoy!
