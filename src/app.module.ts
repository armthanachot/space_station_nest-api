import { Module,NestModule ,MiddlewareConsumer, RequestMethod} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Connection} from "typeorm"
import {User} from "./user/user.entity"
import { UserModule } from './user/user.module';
import {verifyToken} from "../middleware/auth.middle"
import {ROLES} from "../constants/config"
@Module({
  imports: [TypeOrmModule.forRoot({
    type:'mysql',
    host:'localhost',
    port:3306,
    username:'root',
    password:'',
    database:'space_station',
    entities:[User],
    synchronize:true
  }), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private connection:Connection){}
  async configure(consumer:MiddlewareConsumer ){
    const {GET,POST,PUT,DELETE,ALL} = RequestMethod
    const {ADMIN,DEV,USER} = ROLES
    consumer.apply(await verifyToken([ADMIN,USER])).forRoutes({path:'user',method:GET})
    consumer.apply(await verifyToken([DEV])).forRoutes({path:'user/:id',method:GET})
  }
}
