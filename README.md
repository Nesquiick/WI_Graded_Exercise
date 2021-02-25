# WI_Graded_Exercise
***by Loreleï NOIRAUD***

link : https://graded-exercise.herokuapp.com/

**For the project :**
I didn't implement the search of the postings by category/location/date.
As i never done javascript before I took a lot of time to implement the rest of the api and I had to start the front end with react nativ.
I tried to upload my pictures on cloudinary but unfortunately it doesn't worked : the upload of the picture is done in cloudinary but after that, the function doesn't execute itself, it keeps charging.

I unfortunately didn't have the time to implement the test with chai & mocha. However you can use postman with the link provided above.

You can start by :

POST /users :
---
{
    "user_name":"Jon Doe",
    "user_email": "jon.doe@test.fi",
    "user_address":"Oulu, Finland",
    "user_date_birth": "1997-04-24T01:32:09.124+00:00",
    "user_password": "password_123",
    "user_comfirm_password":"password_123"
}
Here is an example of creating a user.
You can add it twice, it will tell you that your email is already use, you can't create an other account.
You can put two different password, it will tell you that they don't match, you have to try again with the same password for both of them.

After creating an account you can login,

GET /users/login :
---
In the Basic Auth of postman:
username : "email of your created account"
password : "your password"

Keep the token that the result gave you and put it in the Baerer Token Authorization of postman For what's following you have to stay logged in.
You can get the id that the result gave you and put it like this :

GET /users/{id_user}
---
You will get all the information you provided during your signup.
Here is an id of an other user : 6037b84b683de93904290195, if you put it instead of yours you cannot see anything. It will be the same with the path that follow.

POST /users/{id_user}/postings:
--- 
{
    "posting_title": "Alice's Adventures in Wonderland",
    "posting_description": "looks new",
    "posting_category": "Books",
    "posting_location": "Ouly, Finland",
    "posting_price": 12,
    "posting_delivery_type": "Shipping"
}
Here is an example of creating a posting.
Keep its id, you can use it for :
    Modify it (with the same patterns):
    PUT /users/{id_user}/postings/{id_posting}
    Delete it :
    DELETE /users/{id_user}/postings/{id_posting}
    See all the postings that you have created with :
    GET /users/{id_user}/postings/

Finaly A logged user or a visitor can acces to:

GET /postings : the list of all information of all postings
GET /postings/{id_postings} : the information of one particular posting

________________________________________________________________________
I learned a lot, even if it was really hard for me, as I never done that kind of programming before.
________________________________________________________________________

**modules used :**
npm i --s express body-parser mongoose@5.11.15 nodemon passport passport-http passport-jwt multer cloudinary multer-storage-cloudinary jsonwebtoken bcryptjs
