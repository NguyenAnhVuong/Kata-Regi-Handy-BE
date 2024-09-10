import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './core/global/auth/guards/jwt-auth.guard';
import { RolesGuard } from './core/global/auth/guards/roles.guard';
import { ConstanceModule } from '@core/global/constance/constance.module';
import { I18nCustomModule } from '@core/global/i18nCustom/i18nCustom.module';
import { HttpExceptionFilter } from '@helper/httpException.filter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EConfiguration } from './core/config/configuration.config';
import { ResponseInterceptor } from './core/interceptor';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { UserModule } from './modules/user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GQLRolesGuard } from '@core/global/auth/guards/gqlRoles.guard';
import { RestaurantModule } from '@modules/restaurant/restaurant.module';
import { MenuModule } from '@modules/menu/menu.module';
import { OrderModule } from '@modules/order/order.module';
import { OrderItemModule } from '@modules/order-item/order-item.module';
import { TableModule } from '@modules/table/table.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get(EConfiguration.DB_POSTGRESQL_HOST),
        port: configService.get<number>(EConfiguration.DB_POSTGRESQL_PORT),
        username: configService.get(EConfiguration.DB_POSTGRESQL_USER),
        password: configService.get(EConfiguration.DB_POSTGRESQL_PASSWORD),
        database: configService.get(EConfiguration.DB_POSTGRESQL_DB),
        entities: [__dirname + '/**/*.entity.{ts,js}'],
        synchronize: true,
        autoLoadEntities: true,
        migrations: ['src/core/database/migrations/**/*.ts'],
        subscribers: ['src/subscriber/**/*.ts'],
      }),
    }),
    I18nCustomModule,
    ConstanceModule,
    UserModule,
    CloudinaryModule,
    RestaurantModule,
    MenuModule,
    OrderModule,
    OrderItemModule,
    TableModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: GQLRolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
