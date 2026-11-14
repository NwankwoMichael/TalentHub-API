<!-- CORRECT REGISTRY ENTRY -->

{
"email": "mike@gmail.com",
"password": "test1234",
"passwordConfirm": "test1234"
"role": "CANDIDATE"
}

<!-- WRONG REGISTER ENTRY WITH DUPLICATE EMAIL -->

{
"email": "mike@example.com",
"email": "mike@example.com",
"role": "EMPLOYER"
}

<!-- WRONG REGISTER ENTRY WITH MISSING PASSWORD -->

{
"email": "mike@example.com",
"passwordConfirm": "test123",
"role": "CANDIDATE"
}

<!-- WRONG REGISTER WITH INVALID ROLE -->

{
"email": "mike@example.com",
"password": "test123",
"passwordConfirm": "test123",
"role": "CANDIDATE"
}

<!-- CORRECT LOGIN ENTRY -->

{
"email": "mike@gmail.com",
"password": "test1234",
}

<!-- WRONG LOGIN ENTRY INCORRECT PASSWORD -->

{
"email": "mike@example.com",
"password": "incorrect"
}

<!-- WRONG LOGIN ENTRY EMAIL NOT FOUND -->

{
"email": "mikelic@example.com",
"password": "test123"
}

<!-- LOGIN FOR INACTIVE USER -->
