import { IsString, MinLength, IsEmail } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(3)
    name: string;

    @IsEmail()
    email: string;
};

// askip [POST /user with {"name": 12, "email": "invalidemail"}]

//Expected response: 400 Bad Request with validation errors for name and email fields.
//{
  //  "message": ["name must be a string", "email must be an email"],
    //"error": "Bad Request",
    //"statusCode": 400
//}