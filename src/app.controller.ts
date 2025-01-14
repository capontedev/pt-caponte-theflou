import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot(): any {
    return {
      message: 'Carlos Aponte - [Prueba Técnica Backend] - theflou.com',
    };
  }
}
