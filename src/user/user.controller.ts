import { Controller, Get, Param, Query, Post, Put, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {  
    constructor(private readonly userService: UserService) {}
    // GET /user
   @Get()
   getUsers(@Query('name') name: string) {
    return this.userService.findAllUsers(name);
    //if(name) {
       // return users.filter((user) => user.name.toLowerCase().includes(name.toLowerCase()));
    //}
   }
   @Get(':id')
   getUserById(@Param('id') id:string) {
    return { id, name: "Ebuka Aranye" };
   }
   @Post()
   createUser(@Body() CreateUserDto: CreateUserDto) {
    return { data: CreateUserDto, message:"User created successfully" };
   }

   @Put(':id')
   updateUser(@Param('id') id: string, @Body() updateUserDto: CreateUserDto) {
    return {
        data: { id, ...updateUserDto },
        message: "User updated successfully",
    }
   }
}
