import { Controller, Get, Param, Query, Post, Put, Body, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import type { User } from './user.service';
import { RoleGuard } from '../guards/role.guard';

@Controller('user')
export class UserController {  
    constructor(private readonly userService: UserService) {}
    // GET /user
   @Get()
   getUsers(@Query('name') name: string): User[] {
    return this.userService.findAllUsers(name);
   }
   @Get(':id')
   getUserById(@Param('id', ParseIntPipe) id: number): User {
    return this.userService.findOneUser(id);
   }
   @Post()
   createUser(@Body() createUserDto: CreateUserDto): User {
    return this.userService.createUser(createUserDto);
   }

   @Put(':id')
   updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): User | null {
    return this.userService.updateUser(Number(id), updateUserDto);
   }

   //Essayer DELETE /user/1 -> 401 -> ROLE: ADMIN -> VALID
   @Delete(':id')
   @UseGuards(RoleGuard)
   deleteUser(@Param('id') id: string): User | null {
    return this.userService.deleteUser(Number(id));
   }
}
