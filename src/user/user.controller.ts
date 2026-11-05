import { Controller, Get, Param, Query } from '@nestjs/common';

@Controller('user')
export class UserController {
    // GET /user
   @Get()
   getUsers(@Query('name') name: string) {
    const users = [
        { id: 1, name: "Ebuka Aranye"},
        { id: 2, name: "Morakinyo Doe"},
    ];
    if(name) {
        return users.filter((user) => user.name.toLowerCase().includes(name.toLowerCase()));
    }
   }
   @Get(':id')
   getUserById(@Param('id') id:string) {
    return { id, name: "Ebuka Aranye" };
   }
}
