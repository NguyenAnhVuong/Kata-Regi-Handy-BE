import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EConfiguration } from 'src/core/config/configuration.config';
import { User } from 'src/core/database/entity/user.entity';
import { JwtStrategy } from 'src/core/global/auth/strategy/jwt.strategy';
//import { UserDetailModule } from '../user-detail/user-detail.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { RestaurantModule } from '@modules/restaurant/restaurant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get(EConfiguration.JWT_SECRET),
        signOptions: {
          expiresIn: configService.get(EConfiguration.ACCESS_TOKEN_EXPIRES_IN),
        },
      }),
    }),
    //UserDetailModule,
    RestaurantModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserResolver, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
